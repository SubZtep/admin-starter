import type { Job } from "@app/schemas"
import { createJobRequestSchema, createJobResponseSchema } from "@app/schemas"
import { zValidator } from "@hono/zod-validator"
import type { RouteRegProps } from "#/types"
import { jobs } from "../../services/queue"

export function registerCreateJob(app: RouteRegProps) {
  app.post("/create-job", zValidator("json", createJobRequestSchema), c => {
    const { type, payload } = c.req.valid("json")

    const jobId = Bun.randomUUIDv7()
    const job: Job = {
      jobId,
      type,
      payload,
      status: "queued",
      createdAt: new Date().toISOString()
    }
    jobs.push(job)

    return c.json(createJobResponseSchema.parse(job))
  })
}
