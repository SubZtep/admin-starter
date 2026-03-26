import { getJobRequestSchema, getJobResponseSchema } from "@app/schemas"
import { zValidator } from "@hono/zod-validator"
import type { RouteRegProps } from "#/types"
import { jobs } from "../../services/queue"

export function registerGetJob(app: RouteRegProps) {
  app.post("/get-job", zValidator("json", getJobRequestSchema), c => {
    const { jobId } = c.req.valid("json")
    if (!jobId) return c.body(null, 400)

    const job = jobs.find(j => j.jobId === jobId)
    if (!job) return c.body(null, 204)

    return c.json(
      getJobResponseSchema.parse({
        jobId: job.jobId,
        type: job.type,
        payload: job.payload
      })
    )
  })
}
