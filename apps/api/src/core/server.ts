import type { ServerWebSocket } from "bun"
import { SchedulerService } from "#/features/kaja/services/scheduler"
import { app } from "../app"
import { pool } from "./db"
import { logger } from "./logger"
import {
  getNotificationCorrelationId,
  isNotificationRequest,
  type NotificationSocketData,
  registerNotificationSocket,
  unregisterNotificationSocket
} from "./notifications"

const port = Number(process.env.PORT ?? 3001)
logger.info({ port }, "API is running")

// Start the scheduler for stale jobs and inactive nodes
const scheduler = new SchedulerService(pool)
scheduler.start()

export default {
  port,
  fetch(request: Request, server: Bun.Server<NotificationSocketData>) {
    if (isNotificationRequest(request)) {
      const correlationId = getNotificationCorrelationId(request)
      if (!correlationId) {
        return new Response("Missing correlation ID", { status: 400 })
      }

      const upgraded = server.upgrade(request, {
        data: {
          correlationId,
          createdAt: Date.now()
        }
      })

      if (upgraded) return
      return new Response("WebSocket upgrade failed", { status: 500 })
    }

    return app.fetch(request)
  },
  websocket: {
    data: {} as NotificationSocketData,
    open(ws: ServerWebSocket<NotificationSocketData>) {
      registerNotificationSocket(ws)
    },
    close(ws: ServerWebSocket<NotificationSocketData>) {
      unregisterNotificationSocket(ws)
    },
    message() {}
  }
}
