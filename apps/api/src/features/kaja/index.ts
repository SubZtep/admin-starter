import { Hono } from "hono"
import { pool } from "#/core/db"
import type { RouteProps } from "#/types"
import { registerCreateJob } from "./routes/job/create-job"
import { registerGetJob } from "./routes/job/get-job"
import { registerSubmitResult } from "./routes/job/submit-result"
import { registerHeartbeat } from "./routes/node/heartbeat"
import { registerRegisterNode } from "./routes/node/register"
import { NodeService } from "./services/node"
import { QueueService } from "./services/queue"

// Initialize services
export const queueService = new QueueService(pool)
export const nodeService = new NodeService(pool)

export const kajaRoutes = new Hono<RouteProps>()

// Middleware to attach services to context
kajaRoutes.use("*", async (c, next) => {
  c.set("queueService", queueService)
  c.set("nodeService", nodeService)
  await next()
})

registerHeartbeat(kajaRoutes)
registerGetJob(kajaRoutes)
registerRegisterNode(kajaRoutes)
registerSubmitResult(kajaRoutes)
registerCreateJob(kajaRoutes)
