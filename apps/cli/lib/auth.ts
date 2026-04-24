import { box, cancel, intro, isCancel, note, outro, select, spinner } from "@clack/prompts"
import { createAuthClient } from "better-auth/client"
import { deviceAuthorizationClient } from "better-auth/client/plugins"
import clipboard from "clipboardy"
import qrcode from "qrcode-terminal"
import { deleteAccessToken, getAccessToken, setAccessToken } from "./token"
import { DEVICE_CLIENT_ID, green, kaja, red } from "./vars"

function createDeviceAuthClient() {
  return createAuthClient({
    baseURL: process.env.API_URL,
    basePath: "/auth",
    plugins: [deviceAuthorizationClient()]
  })
}

export async function authFlow() {
  if (process.argv[2] === "logout") {
    await deleteAccessToken()
    outro("Logged out successfully")
    process.exit()
  }

  const spin = spinner()
  spin.start(`Pinging ${kaja.host()}`)
  await Bun.sleep(669)
  if (!(await kaja.ping())) {
    spin.error(`${red}No Home at ${kaja.host()} 🧟`)
    process.exit(1)
  }
  spin.clear()

  const authClient = createDeviceAuthClient()

  const storedToken = await getAccessToken()
  const { data: oldSession } = await authClient.getSession(
    storedToken ? { fetchOptions: { headers: { Authorization: `Bearer ${storedToken}` } } } : {}
  )
  if (oldSession?.user) {
    // user is already logged in
    return
  }

  const { data, error } = await authClient.device.code({
    client_id: DEVICE_CLIENT_ID
  })
  if (error || !data) {
    console.log(`\n${red}${error?.error_description ?? "Could not start device login"} 🤮`)
    process.exit(1)
  }

  const { device_code, user_code, verification_uri, verification_uri_complete, interval = 5, expires_in = 1800 } = data

  intro("Authentication")

  const link = verification_uri_complete ?? verification_uri
  if (!verification_uri_complete) {
    box(user_code, "User Code", { width: "auto", rounded: true })
  }

  const todo = await select({
    message: "Please sign in",
    options: [
      { value: "open", label: "Open default browser", hint: "Approve CLI login on the web" },
      { value: "qrcode", label: "Scan with your phone", hint: "Display QR code to view with your camera" },
      { value: "copy", label: "Copy link to clipboard", hint: "Open the link manually in your browser" },
      {
        value: "display",
        label: "Show user code",
        hint: "Display URLs and the user code to enter manually"
      }
    ]
  })

  if (isCancel(todo)) {
    cancel("Authentication cancelled")
    process.exit()
  }

  switch (todo) {
    case "open":
      try {
        const { default: open } = await import("open")
        await open(link)
      } catch {
        note(`Could not open a browser. Open this URL manually:\n${link}`, "Device login")
      }
      break
    case "qrcode":
      qrcode.generate(link, { small: true })
      break
    case "copy": {
      try {
        await clipboard.write(link)
        note("Link copied to clipboard. Open the link manually in your browser.", "Device login")
      } catch {
        note(`Could not copy to clipboard. Open this URL manually:\n${link}`, "Device login")
      }
      break
    }
    case "display":
      note(
        `1. Open in a browser:\n${link}\n\n2. Open in a browser:\n${verification_uri}\nThen enter code: ${user_code}`,
        "Device login"
      )
      break
  }

  spin.start("Waiting for user to approve login")
  const token = await pollDeviceToken(authClient, device_code, interval, Date.now() + expires_in * 1000)
  spin.clear()

  try {
    await setAccessToken(token)
  } catch (err) {
    console.error("Failed to store token:", err instanceof Error ? err.message : err)
    process.exit(1)
  }

  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: { Authorization: `Bearer ${token}` }
    }
  })

  outro(`${green}Welcome aboard, ${session?.user?.name ?? session?.user?.email ?? "user"}! 👋`)
}

async function pollDeviceToken(
  authClient: ReturnType<typeof createDeviceAuthClient>,
  deviceCode: string,
  intervalSec: number,
  deadlineMs: number
) {
  const grant_type = "urn:ietf:params:oauth:grant-type:device_code"
  let waitMs = Math.max(intervalSec, 1) * 1000

  while (Date.now() < deadlineMs) {
    await Bun.sleep(waitMs)
    const { data, error } = await authClient.device.token({
      grant_type,
      device_code: deviceCode,
      client_id: DEVICE_CLIENT_ID
    })
    if (data?.access_token) {
      return data.access_token
    }
    const code = error?.error
    if (code === "authorization_pending") {
      continue
    }
    if (code === "slow_down") {
      waitMs += 5000
      continue
    }
    if (code === "access_denied") {
      console.log(`\n${red}Access denied`)
      process.exit(1)
    }
    if (code === "expired_token") {
      console.log(`\n${red}Device code expired — run again`)
      process.exit(1)
    }
    console.log(`\n${red}${error?.error_description ?? code ?? "Device token error"} 🤮`)
    process.exit(1)
  }

  console.log(`\n${red}Device authorization timed out`)
  process.exit(1)
}
