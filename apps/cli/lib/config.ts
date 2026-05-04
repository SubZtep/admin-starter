import { existsSync, readFileSync } from "node:fs"
import { mkdir, rename, rm, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import envPaths from "env-paths"
import { z } from "zod"

const CONFIG_FILE_NAME = "config.json"
const CONFIG_VERSION = 1
const DEFAULT_API_URL = "http://localhost:3001"

const DEFAULT_CONFIG = {
  version: CONFIG_VERSION
} as const

const optionalTrimmedStringSchema = z.preprocess(value => {
  if (typeof value !== "string") {
    return undefined
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}, z.string().optional())

const ollamaSchema = z.preprocess(
  value => (typeof value === "object" && value !== null && !Array.isArray(value) ? value : undefined),
  z
    .object({
      host: optionalTrimmedStringSchema,
      model: optionalTrimmedStringSchema
    })
    .optional()
)

const cliConfigSchema = z.object({
  version: z.literal(CONFIG_VERSION).optional(),
  apiUrl: optionalTrimmedStringSchema,
  ollama: ollamaSchema
})

const writePatchSchema = z.object({
  apiUrl: optionalTrimmedStringSchema,
  ollama: ollamaSchema
})

function normalizeConfig(input: unknown) {
  const parsed = cliConfigSchema.safeParse(input)
  if (!parsed.success) {
    return { ...DEFAULT_CONFIG }
  }

  const ollama = parsed.data.ollama
  return {
    version: CONFIG_VERSION,
    apiUrl: parsed.data.apiUrl,
    ollama: ollama?.host || ollama?.model ? ollama : undefined
  }
}

function normalizePatch(input: unknown) {
  const parsed = writePatchSchema.safeParse(input)
  if (!parsed.success) {
    return {}
  }

  const ollama = parsed.data.ollama
  return {
    apiUrl: parsed.data.apiUrl,
    ollama: ollama?.host || ollama?.model ? ollama : undefined
  }
}

function readRawConfigFile() {
  const path = getConfigPath()
  if (!existsSync(path)) {
    return null
  }

  try {
    const raw = readFileSync(path, "utf8")
    return JSON.parse(raw)
  } catch (error) {
    console.warn(`[kaja] Could not read config at ${path}: ${error instanceof Error ? error.message : String(error)}`)
    return null
  }
}

function readArgValue(flag: string) {
  const args = process.argv.slice(2)

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === flag) {
      return optionalTrimmedStringSchema.parse(args[i + 1])
    }

    const withValuePrefix = `${flag}=`
    if (arg.startsWith(withValuePrefix)) {
      return optionalTrimmedStringSchema.parse(arg.slice(withValuePrefix.length))
    }
  }

  return undefined
}

export function getConfigPath() {
  const paths = envPaths("kaja")
  return join(paths.config, CONFIG_FILE_NAME)
}

export function readConfig() {
  return normalizeConfig(readRawConfigFile())
}

export async function writeConfig(patch: {
  apiUrl?: string
  ollama?: {
    host?: string
    model?: string
  }
}) {
  const current = readConfig()
  const normalizedPatch = normalizePatch(patch)
  const next = normalizeConfig({
    ...current,
    ...normalizedPatch,
    ollama:
      current.ollama || normalizedPatch.ollama
        ? {
            ...current.ollama,
            ...normalizedPatch.ollama
          }
        : undefined
  })

  const path = getConfigPath()
  const tempPath = `${path}.tmp`
  await mkdir(dirname(path), { recursive: true })
  await writeFile(tempPath, `${JSON.stringify(next, null, 2)}\n`, "utf8")
  await rename(tempPath, path)
  return next
}

export async function clearConfig() {
  await rm(getConfigPath(), { force: true })
}

export function resolveApiUrl() {
  return (
    readArgValue("--api-url") ??
    optionalTrimmedStringSchema.parse(process.env.API_URL) ??
    readConfig().apiUrl ??
    DEFAULT_API_URL
  )
}
