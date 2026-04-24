import { cancel, isCancel, log, select, text } from "@clack/prompts"
import ollama, { type ModelResponse, Ollama } from "ollama"

export async function configFlow() {
  let models: ModelResponse[] | undefined
  try {
    const res = await ollama.list()
    models = res.models
  } catch (error: any) {
    log.error(error.message)
  }

  if (!models || models.length === 0) {
    const url = await text({
      message: "Enter the URL of your Ollama instance",
      placeholder: "http://localhost:11434"
    })
    if (isCancel(url)) {
      cancel("No URL provided")
      process.exit(1)
    }
    const trimmed = url.trim()
    if (!trimmed) {
      cancel("Empty URL provided")
      process.exit(1)
    }
    const remote = new Ollama({ host: trimmed })
    try {
      const res = await remote.list()
      models = res.models
    } catch (error: any) {
      cancel(error.message)
      process.exit(1)
    }
  }

  if (!models || models.length === 0) {
    cancel("No models found")
    process.exit(1)
  }

  let model: ModelResponse | undefined
  if (models.length === 1) {
    model = models[0]
  } else {
    model = (await select({
      message: "Select your preferred model",
      options: models.map(m => ({ value: m, label: m.name }))
    })) as ModelResponse
    if (isCancel(model)) {
      cancel("No model selected")
      process.exit(1)
    }
  }

  console.log("SAVE", model)
}
