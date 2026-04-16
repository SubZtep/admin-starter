import {
  NOTIFICATION_CORRELATION_ID_QUERY_PARAM,
  NOTIFICATION_SOCKET_PATH,
  NOTIFICATION_SOCKET_TIMEOUT_MS
} from "@app/shared"
import type { ServerWebSocket } from "bun"

export interface NotificationSocketData {
  correlationId: string
  createdAt: number
}

interface NotificationEvent {
  type: "auth-email-error"
  flow: "reset-password"
  message: string
}

const sockets = new Map<string, ServerWebSocket<NotificationSocketData>>()
const timeouts = new Map<string, ReturnType<typeof setTimeout>>()

function clearSocketTimeout(correlationId: string) {
  const timeout = timeouts.get(correlationId)
  if (!timeout) return
  clearTimeout(timeout)
  timeouts.delete(correlationId)
}

function releaseSocket(correlationId: string, ws?: ServerWebSocket<NotificationSocketData>) {
  const activeSocket = sockets.get(correlationId)
  if (ws && activeSocket !== ws) return
  sockets.delete(correlationId)
  clearSocketTimeout(correlationId)
}

function scheduleSocketExpiry(ws: ServerWebSocket<NotificationSocketData>) {
  clearSocketTimeout(ws.data.correlationId)
  const timeout = setTimeout(() => {
    if (sockets.get(ws.data.correlationId) !== ws) return
    releaseSocket(ws.data.correlationId, ws)
    ws.close(1000, "timeout")
  }, NOTIFICATION_SOCKET_TIMEOUT_MS)
  timeouts.set(ws.data.correlationId, timeout)
}

export function isNotificationRequest(request: Request) {
  const url = new URL(request.url)
  return request.method === "GET" && url.pathname === NOTIFICATION_SOCKET_PATH
}

export function getNotificationCorrelationId(request: Request) {
  const url = new URL(request.url)
  return url.searchParams.get(NOTIFICATION_CORRELATION_ID_QUERY_PARAM)?.trim() || null
}

export function registerNotificationSocket(ws: ServerWebSocket<NotificationSocketData>) {
  const existingSocket = sockets.get(ws.data.correlationId)
  if (existingSocket && existingSocket !== ws) {
    releaseSocket(ws.data.correlationId, existingSocket)
    existingSocket.close(1000, "replaced")
  }

  sockets.set(ws.data.correlationId, ws)
  scheduleSocketExpiry(ws)
}

export function unregisterNotificationSocket(ws: ServerWebSocket<NotificationSocketData>) {
  releaseSocket(ws.data.correlationId, ws)
}

export function notifyAuthEmailError(correlationId: string, message: string) {
  const ws = sockets.get(correlationId)
  if (!ws) return false

  const payload: NotificationEvent = {
    type: "auth-email-error",
    flow: "reset-password",
    message
  }

  ws.send(JSON.stringify(payload))
  releaseSocket(correlationId, ws)
  ws.close(1000, "delivered")
  return true
}
