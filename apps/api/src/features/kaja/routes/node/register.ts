import { registerNodeRequestSchema, registerNodeResponseSchema } from "@app/schemas"
import { zValidator } from "@hono/zod-validator"
import type { RouteRegProps } from "#/types"

export function registerRegisterNode(app: RouteRegProps) {
  app.post("/register-node", zValidator("json", registerNodeRequestSchema), async c => {
    const body = c.req.valid("json")
    const nodeService = c.get("nodeService")

    const nodeId = body.nodeId || Bun.randomUUIDv7()

    await nodeService.registerNode({
      nodeId,
      name: body.name,
      capabilities: body.capabilities
    })

    return c.json(
      registerNodeResponseSchema.parse({
        nodeId,
        pollIntervalMs: 2000
      })
    )
  })
}
