import { KajaWorkerClient } from "lib/kaja-sdk"
import { OllamaClient } from "lib/ollama-sdk"

export const red = Bun.color("#880808", "ansi")
export const pink = Bun.color("pink", "ansi")
export const cyan = Bun.color("cyan", "ansi")
export const green = Bun.color("green", "ansi")
export const lime = Bun.color("lime", "ansi")

// singletons
export const kaja = new KajaWorkerClient()
export const ollama = new OllamaClient()
