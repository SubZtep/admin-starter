import { app } from "./app"
import { logger } from "./logger"

const port = Number(process.env.PORT ?? 3001)
logger.info({ port }, "API is running")

export default {
  port,
  fetch: app.fetch
}
