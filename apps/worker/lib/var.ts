import { KajaWorkerClient } from "./kaja-sdk"
import { OllamaClient } from "./ollama-sdk"

export const red = Bun.color("#880808", "ansi")
export const pink = Bun.color("pink", "ansi")
export const cyan = Bun.color("cyan", "ansi")
export const green = Bun.color("green", "ansi")
export const lime = Bun.color("lime", "ansi")
export const dimgrey = Bun.color("#6969", "ansi")

// singletons
export const kaja = new KajaWorkerClient()
export const ollama = new OllamaClient()
