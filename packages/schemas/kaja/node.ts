import { z } from "zod"
import { jobDataSchema } from "./job"

export const heartbeatRequestSchema = z.object({
  nodeId: z.uuidv7(),
  status: z.enum(["idle", "busy"]),
  currentJobId: z.uuidv7().optional()
})

export const heartbeatResponseSchema = z.object({
  ok: z.boolean()
})

export const createJobRequestSchema = jobDataSchema.omit({
  id: true
})

export const createJobResponseSchema = z.object({
  jobId: z.uuidv7()
})

export const getJobRequestSchema = z.object({
  nodeId: z.uuidv7()
})

export const getJobResponseSchema = jobDataSchema

export const registerNodeRequestSchema = z.object({
  nodeId: z.uuidv7().optional(),
  /** @example "andras-macbook" */
  name: z.string(),
  capabilities: z
    .object({
      /** @example ["llama3", "moondream:1.8b"] */
      models: z.array(z.string()),
      gpu: z.boolean(),
      /** @example 16 */
      memoryGb: z.number().int()
    })
    .optional()
})

export const registerNodeResponseSchema = z.object({
  /** server generated or confirmed id */
  nodeId: z.uuidv7(),
  /** @example 2000 */
  pollIntervalMs: z.number().int()
})

export const submitResultRequestSchema = z.object({
  nodeId: z.uuidv7(),
  jobId: z.uuidv7(),
  status: z.enum(["success", "error"]),
  result: z
    .object({
      text: z.string()
    })
    .optional(),
  error: z.string().optional()
})

export const submitResultResponseSchema = z.object({
  ok: z.boolean()
})

export type HeartbeatRequest = z.infer<typeof heartbeatRequestSchema>
export type HeartbeatResponse = z.infer<typeof heartbeatResponseSchema>
export type CreateJobRequest = z.infer<typeof createJobRequestSchema>
export type CreateJobResponse = z.infer<typeof createJobResponseSchema>
export type GetJobRequest = z.infer<typeof getJobRequestSchema>
export type GetJobResponse = z.infer<typeof getJobResponseSchema>
export type RegisterNodeRequest = z.infer<typeof registerNodeRequestSchema>
export type RegisterNodeResponse = z.infer<typeof registerNodeResponseSchema>
export type SubmitResultRequest = z.infer<typeof submitResultRequestSchema>
export type SubmitResultResponse = z.infer<typeof submitResultResponseSchema>
