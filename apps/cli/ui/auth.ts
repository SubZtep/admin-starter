import { cancel, log, note, outro } from "@clack/prompts"
import { KAJA_CLI_CLIENT_ID } from "@kaja/schemas"
import { createAuthClient } from "better-auth/client"
import { deviceAuthorizationClient } from "better-auth/client/plugins"
import clipboard from "clipboardy"
import qrcode from "qrcode-terminal"
import { deleteAccessToken, getAccessToken, setAccessToken, setSessionAccessToken } from "../lib/token"
import { cyan, kaja, red } from "../lib/vars"

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
  const cleanupLoginActions = listenForLoginActions(link)
  let token: string

  try {
    token = await pollDeviceToken(authClient, device_code, interval, Date.now() + expires_in * 1000)
  } finally {
    cleanupLoginActions()
  }

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

function listenForLoginActions(link: string) {
  const stdin = process.stdin
  const canReadKeys = stdin.isTTY && typeof stdin.setRawMode === "function"

  if (!canReadKeys) {
    log.message("Waiting for browser approval...")
    return () => {}
  }

  const wasRaw = stdin.isRaw
  const wasPaused = stdin.isPaused()
  let cleanedUp = false

  const cleanup = () => {
    if (cleanedUp) {
      return
    }

    cleanedUp = true
    stdin.off("data", onData)
    stdin.setRawMode(wasRaw)

    if (wasPaused) {
      stdin.pause()
    }
  }

  const onData = (data: Buffer) => {
    const input = data.toString("utf8").toLowerCase()

    for (const key of input) {
      switch (key) {
        case "\u0003":
          cleanup()
          cancel("Authentication cancelled")
          process.exit()
        case "o":
          openLoginLink(link)
          break
        case "q":
          qrcode.generate(link, { small: true })
          break
        case "c":
          copyLoginLink(link)
          break
      }
    }
  }

  log.message("Waiting for approval... Press o to open, c to copy, q for QR, or Ctrl+C to cancel.")
  stdin.setRawMode(true)
  stdin.resume()
  stdin.on("data", onData)

  return cleanup
}

async function openLoginLink(link: string) {
  try {
    const { default: open } = await import("open")
    await open(link)
  } catch {
    log.error("Could not open a browser. Please open the link manually, then approve the login.")
  }
}

async function copyLoginLink(link: string) {
  try {
    await clipboard.write(link)
    log.success("Link copied to clipboard. Paste it into your browser, then approve the login.")
  } catch {
    log.error("Could not copy to clipboard. Please paste the link manually into your browser, then approve the login.")
  }
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
