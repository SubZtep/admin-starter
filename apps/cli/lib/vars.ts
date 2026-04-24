import { KajaClient } from "./kaja-sdk"
import { OllamaClient } from "./ollama-sdk"

declare module "bun" {
  interface Env {
    /** API base URL without trailing slash */
    API_URL: string
  }
}

export const red = Bun.color("#880808", "ansi")
export const pink = Bun.color("pink", "ansi")
export const cyan = Bun.color("cyan", "ansi")
export const purple = Bun.color("purple", "ansi")
export const green = Bun.color("green", "ansi")
export const lime = Bun.color("lime", "ansi")
export const dimgrey = Bun.color("#6969", "ansi")

/** OAuth client ID for device authorization */
export const DEVICE_CLIENT_ID = "kaja-cli"
export const SERVICE_NAME = "io.kaja"
export const ACCESS_TOKEN_KEY = "access_token"

// singletons
export const kaja = new KajaClient()
export const ollama = new OllamaClient()
