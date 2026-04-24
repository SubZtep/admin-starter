import { cancel, isCancel, note, tasks, text } from "@clack/prompts"
import { createAuthClient } from "better-auth/client"
import { deviceAuthorizationClient } from "better-auth/client/plugins"
import { setAccessToken } from "./token"
import { kaja, red } from "./vars"

const DEVICE_CLIENT_ID = "kaja-cli"

function apiBaseUrl() {
  return (process.env.KAJA_API_URL ?? "https://kaja.io").replace(/\/$/, "")
}

function createDeviceAuthClient() {
  return createAuthClient({
    baseURL: apiBaseUrl(),
    basePath: "/auth",
    plugins: [deviceAuthorizationClient()]
  })
}

export async function resolveEmail() {
  const entered = await text({
    message: "Email",
    placeholder: "you@example.com",
    validate(value) {
      const v = value?.trim() ?? ""
      if (!v) return "Email is required"
      if (!v.includes("@")) return "Enter a valid email"
    }
  })
  if (isCancel(entered)) {
    cancel("Cancelled")
    process.exit(0)
  }
  return entered
}

export async function authFlow() {
  await tasks([
    {
      title: "Phone home",
      task: async () => {
        await Bun.sleep(500)
        if (!(await kaja.ping())) {
          console.log(`\n${red}No Home at ${kaja.host()} 🧟`)
          process.exit(1)
        }
        return `Connected to ${kaja.host()}`
      }
    },
    {
      title: "Authenticate",
      task: async () => {
        const authClient = createDeviceAuthClient()
        const { data, error } = await authClient.device.code({
          client_id: DEVICE_CLIENT_ID
        })
        if (error || !data) {
          console.log(`\n${red}${error?.error_description ?? "Could not start device login"} 🤮`)
          process.exit(1)
        }

        const {
          device_code,
          user_code,
          verification_uri,
          verification_uri_complete,
          interval = 5,
          expires_in = 1800
        } = data

        note(
          `Open in a browser:\n${verification_uri_complete ?? verification_uri}\n\nThen enter code: ${user_code}`,
          "Device login"
        )

        try {
          const { default: open } = await import("open")
          await open(verification_uri_complete ?? verification_uri)
        } catch {
          // headless / no display
        }

        const token = await pollDeviceToken(authClient, device_code, interval, Date.now() + expires_in * 1000)

        try {
          await setAccessToken(token)
        } catch (err: unknown) {
          console.error("Failed to store token:", err instanceof Error ? err.message : err)
          process.exit(1)
        }

        const { data: session } = await authClient.getSession({
          fetchOptions: {
            headers: { Authorization: `Bearer ${token}` }
          }
        })

        return `Authenticated as ${session?.user?.email ?? session?.user?.name ?? "user"}`
      }
    }
  ])
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
