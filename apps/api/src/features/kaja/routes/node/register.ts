import { registerNodeRequestSchema, registerNodeResponseSchema } from "@app/schemas"
import { zValidator } from "@hono/zod-validator"
import type { RouteRegProps } from "#/types"
import { nodes } from "../../services/queue"

export function registerRegisterNode(app: RouteRegProps) {
  app.post("/register-node", zValidator("json", registerNodeRequestSchema), async c => {
    const body = c.req.valid("json")
    const nodeId = body.nodeId || Bun.randomUUIDv7()

    nodes.set(nodeId, {
      nodeId,
      name: body.name,
      capabilities: body.capabilities,
      lastSeen: Date.now(),
      status: "idle"
    })

    return c.json(
      registerNodeResponseSchema.parse({
        nodeId,
        pollIntervalMs: 2000
      })
    )
  })
}
