import { heartbeatRequestSchema, heartbeatResponseSchema } from "@app/schemas"
import { zValidator } from "@hono/zod-validator"
import type { RouteRegProps } from "#/types"
import { nodes } from "../../services/queue"

export function registerHeartbeat(app: RouteRegProps) {
  app.post("/heartbeat", zValidator("json", heartbeatRequestSchema), async c => {
    const body = c.req.valid("json")

    const node = nodes.get(body.nodeId)
    if (!node) return c.json({ error: "unknown node" }, 404)

    node.lastSeen = Date.now()
    node.status = body.status
    node.currentJobId = body.currentJobId

    return c.json(heartbeatResponseSchema.parse({ ok: true }))
  })
}
