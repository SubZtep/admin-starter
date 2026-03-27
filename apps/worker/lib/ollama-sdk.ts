import type { JobData } from "@app/schemas"
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

  async listModels() {
    const res = await $`ollama list`.quiet()
    return res.stdout
      .toString()
      .split("\n")
      .slice(1)
      .map(line => line.split(" ")[0].trim())
      .filter(Boolean)
  }

  async runJob(job: JobData) {
    const res = await $`ollama run ${job.payload.model} """${job.payload.prompt}"""`.quiet()
    return res.stdout.toString().trim()
  }
}
