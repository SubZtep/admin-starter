import { zValidator } from "@hono/zod-validator"
import { createJobRequestSchema, createJobResponseSchema } from "@kaja/schemas"
import type { RouteRegProps } from "#/types"

export function registerCreateJob(app: RouteRegProps) {
  app.post("/create-job", zValidator("json", createJobRequestSchema), async c => {
    const { type, payload } = c.req.valid("json")
    const queueService = c.get("queueService")

    const job = await queueService.createJob({
      type,
      payload,
      status: "queued",
      createdAt: new Date().toISOString()
    })

    return c.json(createJobResponseSchema.parse({ jobId: job.id }))
  })
}
