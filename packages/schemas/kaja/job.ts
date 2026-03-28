import { z } from "zod"

export const jobPayloadSchema = z.object({
  /** @example "llama3" */
  model: z.string(),
  /** @example "explain event loop simply" */
  prompt: z.string()
})

export const jobDataSchema = z.object({
  id: z.uuid(),
  /** @example "ollama.generate" */
  type: z.string(),
  payload: jobPayloadSchema
})

export const jobSchema = jobDataSchema.extend({
  status: z.enum(["queued", "assigned", "done", "error"]),
  assignedTo: z.string().optional(),
  createdAt: z.iso.datetime()
})

export type Job = z.infer<typeof jobSchema>
export type JobData = z.infer<typeof jobDataSchema>
