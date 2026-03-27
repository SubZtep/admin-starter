import { box, spinner, tasks } from "@clack/prompts"
import { KajaWorkerClient } from "./kaja-sdk"
import { OllamaClient } from "./ollama-sdk"
import { cyan, red } from "./var"

const kaja = new KajaWorkerClient()
const ollama = new OllamaClient()

export async function validateConnections() {
  await tasks([
    {
      title: "Phone home",
      task: async () => {
        await Bun.sleep(250)
        if (!(await kaja.ping())) {
          console.log(`\n${red}No Home ☄️`)
          process.exit(1)
        }
        return `Connected to ${kaja.host()}`
      }
    },
    {
      title: "Signal Ollama",
      task: async () => {
        await Bun.sleep(250)
        if (!(await ollama.ping())) {
          console.log(`\n${red}No Llama 🐒`)
          process.exit(1)
        }
        return "Ollama detected"
      }
    },
    {
      title: "Check available models",
      task: async () => {
        await Bun.sleep(500)
        const models = await ollama.listModels({ hideVersion: true })
        if (models.length === 0) {
          console.log(`\n${red}No models found 🪹`)
          process.exit(1)
        }
        return `Model ${models[0].split(":")[0]} ready`
      }
    }
  ])

  box(`${cyan}Looking good! 💋`, undefined, {
    width: "auto",
    contentPadding: 1,
    rounded: true
  })
}

/** Idle state */
export async function waitingForJobs() {
  const spin = spinner()
  spin.start("Waiting for jobs")
  await Bun.sleep(3000)
  spin.stop("Giving up the ghost 😵‍💫")
  spin.cancel()
  return true
}
