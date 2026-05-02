import { zValidator } from "@hono/zod-validator"
import { getJobRequestSchema, getJobResponseSchema } from "@kaja/schemas"
import type { RouteRegProps } from "#/types"

export function registerGetJob(app: RouteRegProps) {
  app.post("/get-job", zValidator("json", getJobRequestSchema), async c => {
    const { nodeId } = c.req.valid("json")
    const queueService = c.get("queueService")
    const nodeService = c.get("nodeService")

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
    await nodeService.heartbeat(nodeId, "busy", job.id)

    return c.json(getJobResponseSchema.parse(job))
  })
}
