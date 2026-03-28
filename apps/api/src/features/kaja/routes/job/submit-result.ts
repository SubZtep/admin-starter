import { submitResultRequestSchema, submitResultResponseSchema } from "@app/schemas"
import { zValidator } from "@hono/zod-validator"
import type { RouteRegProps } from "#/types"

export function registerSubmitResult(app: RouteRegProps) {
  app.post("/submit-result", zValidator("json", submitResultRequestSchema), async c => {
    const body = c.req.valid("json")
    const queueService = c.get("queueService")
    const nodeService = c.get("nodeService")

    // Submit the job result
    const success = await queueService.submitResult(body.jobId, body.status, body.result, body.error)

    if (!success) {
      return c.json({ error: "job not found" }, 404)
    }

    // Update node status back to idle
    await nodeService.heartbeat(body.nodeId, "idle", undefined)

    return c.json(submitResultResponseSchema.parse({ ok: true }))
  })
}
