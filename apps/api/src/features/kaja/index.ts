import { Hono } from "hono"
import type { RouteProps } from "#/types"
import { registerCreateJob } from "./routes/job/create-job"
import { registerGetJob } from "./routes/job/get-job"
import { registerSubmitResult } from "./routes/job/submit-result"
import { registerHeartbeat } from "./routes/node/heartbeat"
import { registerRegisterNode } from "./routes/node/register"

export const kajaRoutes = new Hono<RouteProps>()

registerHeartbeat(kajaRoutes)
registerGetJob(kajaRoutes)
registerRegisterNode(kajaRoutes)
registerSubmitResult(kajaRoutes)
registerCreateJob(kajaRoutes)
