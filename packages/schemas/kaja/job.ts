import { z } from "zod"

/**
 * @example
 * {
 *  "jobId": "job-xyz",
 *  "type": "ollama.generate",
 *  "payload": {
 *    "model": "llama3",
 *    "prompt": "Explain event loop simply"
 *  }
 * }
 */
export const jobSchema = z.object({
  jobId: z.string(),
  type: z.string(),
  status: z.enum(["queued", "assigned", "done", "error"]),
  assignedTo: z.string().optional(),
  createdAt: z.iso.datetime(),
  payload: {
    model: z.string(),
    prompt: z.string()
  }
})

export type Job = z.infer<typeof jobSchema>
