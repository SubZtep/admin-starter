import { $ } from "bun"

/** CLI only */
export class OllamaClient {
  async ping() {
    try {
      await $`ollama -v`.quiet()
    } catch {
      return false
    }
    return true
  }

  async listModels({ hideVersion = false }: { hideVersion?: boolean } = {}) {
    const res = await $`ollama list`.quiet()
    return res.stdout
      .toString()
      .split("\n")
      .slice(1)
      .map(line => (hideVersion ? line.split(" ")[0].trim() : line.trim()))
      .filter(Boolean)
  }
}
