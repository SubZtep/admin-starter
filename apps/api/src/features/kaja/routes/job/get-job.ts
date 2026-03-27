import { getJobRequestSchema, getJobResponseSchema } from "@app/schemas"
import { zValidator } from "@hono/zod-validator"
import type { RouteRegProps } from "#/types"

export function registerGetJob(app: RouteRegProps) {
  app.post("/get-job", zValidator("json", getJobRequestSchema), async c => {
    const body = c.req.valid("json")
    const queueService = c.get("queueService")
    const nodeService = c.get("nodeService")

    // If a specific jobId is requested, return it (for testing/debugging)
    if (body.jobId) {
      // For now, we don't have a getJobById method, so we return 204
      // Could add this to QueueService if needed
      return c.body(null, 204)
    }

    // Get nodeId from request body or query param
    const nodeId = body.nodeId || c.req.query("nodeId")
    if (!nodeId) {
      return c.json({ error: "nodeId is required to claim a job" }, 400)
    }

    // Verify node exists
    const node = await nodeService.getNode(nodeId)
    if (!node) {
      return c.json({ error: "unknown node" }, 404)
    }

    // Claim next available job
    const job = await queueService.getNextJob(nodeId)

    if (!job) {
      return c.body(null, 204)
    }

    // Update node status to busy
    await nodeService.heartbeat(nodeId, "busy", job.jobId)

    return c.json(
      getJobResponseSchema.parse({
        jobId: job.jobId,
        type: job.type,
        payload: job.payload
      })
    )
  })
}
