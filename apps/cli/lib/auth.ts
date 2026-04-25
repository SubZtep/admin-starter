import { KAJA_CLI_CLIENT_ID } from "@app/schemas"
import { cancel, isCancel, log, note, outro, select } from "@clack/prompts"
import { createAuthClient } from "better-auth/client"
import { deviceAuthorizationClient } from "better-auth/client/plugins"
import clipboard from "clipboardy"
import qrcode from "qrcode-terminal"
import { deleteAccessToken, getAccessToken, setAccessToken, setSessionAccessToken } from "./token"
import { cyan, kaja, red } from "./vars"

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

  if (!(await kaja.ping())) {
    cancel(`${red}No Home at ${kaja.host()} 🧟`)
    process.exit(1)
  }

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
    client_id: KAJA_CLI_CLIENT_ID
  })
  if (error || !data) {
    cancel(error?.error_description ?? "Could not start device login")
    process.exit(1)
  }

  const { device_code, user_code, verification_uri, verification_uri_complete, interval = 5, expires_in = 1800 } = data

  // MARK: Authentication

  if (verification_uri_complete) {
    log.message(`Login link: ${verification_uri_complete}`)
  } else if (verification_uri) {
    log.message(`Login link: ${verification_uri}`)
    log.message(`User code: ${user_code}`)
  } else {
    cancel("No login link found")
    process.exit(1)
  }

  const link = verification_uri_complete ?? verification_uri

  const todo = await select({
    message: "Please sign in",
    options: [
      { value: "open", label: "Open default browser", hint: "Approve CLI login on the web" },
      { value: "qrcode", label: "Scan with your phone", hint: "Display QR code to view with your camera" },
      { value: "copy", label: "Copy link to clipboard", hint: "Open the link manually in your browser" }
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
        log.error("Could not open a browser. Please open the link manually.")
      }
      break
    case "qrcode":
      qrcode.generate(link, { small: true })
      break
    case "copy":
      try {
        await clipboard.write(link)
        log.success("Link copied to clipboard. Please paste it into your browser.")
      } catch {
        log.error("Could not copy to clipboard. Please paste the link manually into your browser.")
      }
      break
  }

  const token = await pollDeviceToken(authClient, device_code, interval, Date.now() + expires_in * 1000)

  try {
    await setAccessToken(token)
  } catch (err) {
    setSessionAccessToken(token)
    log.error(
      `Could not save the token to the system secret store (${err instanceof Error ? err.message : String(err)}). You stay signed in for this CLI run only — next time, fix the store or sign in again.`
    )
  }

  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: { Authorization: `Bearer ${token}` }
    }
  })

  note(`${cyan}Welcome aboard, ${session?.user?.name ?? session?.user?.email ?? "user"}!`, "👋")
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
      client_id: KAJA_CLI_CLIENT_ID
    })
    if (data?.access_token) {
      return data.access_token
    }
    switch (error?.error) {
      case "authorization_pending":
        continue
      case "slow_down":
        waitMs += 5000
        continue
      case "access_denied":
        cancel("Access denied")
        process.exit(1)
      case "expired_token":
        cancel("Device code expired — run again")
        process.exit(1)
      default:
        cancel(error?.error ?? "Device token error")
        process.exit(1)
    }
  }

  cancel("Device authorization timed out")
  process.exit(1)
}
