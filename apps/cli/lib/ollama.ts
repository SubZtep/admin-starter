import { cancel, isCancel, log, select, text } from "@clack/prompts"
import { getTimeAgo } from "@kaja/shared"
import ollama, { type ModelResponse, Ollama } from "ollama"
import { readConfig, writeConfig } from "./config"

export async function configFlow() {
  const existing = readConfig()
  const configuredHost = existing.ollama?.host?.trim()
  const configuredModel = existing.ollama?.model?.trim()

  let models: ModelResponse[] | undefined
  let selectedHost = configuredHost

  if (configuredHost) {
    try {
      const res = await new Ollama({ host: configuredHost }).list()
      models = res.models
    } catch (error: any) {
      log.warn(`Configured host unreachable: ${error.message}`)
    }
  }

  if (!models || models.length === 0) {
    try {
      const res = await ollama.list()
      models = res.models
      selectedHost = undefined
    } catch (error: any) {
      log.error(error.message)
    }
  }

  if (!models || models.length === 0) {
    const url = await text({
      message: "Enter the URL of your Ollama instance",
      placeholder: configuredHost ?? "http://localhost:11434"
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
    selectedHost = trimmed
    const remote = new Ollama({ host: selectedHost })
    try {
      const res = await remote.list()
      models = res.models
    } catch (error: any) {
      cancel(error.message)
      process.exit(1)
    }
  }

  // @ts-ignore
  models = models?.filter(m => !m?.remote_host)?.sort((a, b) => a.name.localeCompare(b.name))

  if (!models || models.length === 0) {
    cancel("No models found")
    process.exit(1)
  }

  let model: ModelResponse | undefined
  if (models.length === 1) {
    model = models[0]
  } else if (configuredModel) {
    model = models.find(entry => entry.name === configuredModel)
  }

  if (!model && models.length > 1) {
    model = (await select({
      maxItems: 15,
      message: "Select your preferred model",
      options: models.map(model => ({
        value: model,
        label: model.name,
        hint: [
          model.details.parameter_size,
          model.details.quantization_level,
          getTimeAgo(new Date(model.modified_at))
        ].join(" · ")
      }))
    })) as ModelResponse
    if (isCancel(model)) {
      cancel("No model selected")
      process.exit(1)
    }
  }

  await writeConfig({
    ollama: {
      host: selectedHost,
      model: model?.name
    }
  })
  log.success(`Saved model: ${model?.name}`)
}
