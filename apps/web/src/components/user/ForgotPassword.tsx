import { loginSchema } from "@app/schemas"
import {
  NOTIFICATION_CORRELATION_ID_HEADER,
  NOTIFICATION_CORRELATION_ID_QUERY_PARAM,
  NOTIFICATION_SOCKET_PATH,
  NOTIFICATION_SOCKET_TIMEOUT_MS
} from "@app/shared"
import { CheckCircle, LoaderCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { ConfirmDialog } from "#/components/ui/ConfirmDialog"
import { useAuthClient } from "#/hooks/auth-client"

interface AuthEmailErrorEvent {
  type: "auth-email-error"
  flow: "reset-password"
  message: string
}

function getNotificationSocketUrl(apiUrl: string, correlationId: string) {
  const url = new URL(NOTIFICATION_SOCKET_PATH, apiUrl)
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
  url.searchParams.set(NOTIFICATION_CORRELATION_ID_QUERY_PARAM, correlationId)
  return url.toString()
}

function isAuthEmailErrorEvent(value: unknown): value is AuthEmailErrorEvent {
  if (!value || typeof value !== "object") return false
  return (
    "type" in value &&
    "flow" in value &&
    "message" in value &&
    value.type === "auth-email-error" &&
    value.flow === "reset-password" &&
    typeof value.message === "string"
  )
}

export function ForgotPassword({
  getEmail,
  children
}: Readonly<{ getEmail: () => string; children: React.ReactElement }>) {
  const authClient = useAuthClient()
  const apiUrl = import.meta.env.VITE_API_URL ?? ""
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const closeTimeoutRef = useRef<number | null>(null)

  const cleanupNotificationSocket = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }

    const socket = socketRef.current
    socketRef.current = null

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close(1000, "done")
      return
    }

    socket?.close()
  }

  const openNotificationSocket = (correlationId: string) => {
    cleanupNotificationSocket()

    const socket = new WebSocket(getNotificationSocketUrl(apiUrl, correlationId))
    socketRef.current = socket

    closeTimeoutRef.current = window.setTimeout(() => {
      if (socketRef.current !== socket) return
      cleanupNotificationSocket()
    }, NOTIFICATION_SOCKET_TIMEOUT_MS)

    socket.addEventListener("message", event => {
      try {
        const payload = JSON.parse(event.data as string)
        if (!isAuthEmailErrorEvent(payload)) return
        setSent(false)
        toast.error(payload.message)
      } catch {
        return
      } finally {
        if (socketRef.current === socket) {
          cleanupNotificationSocket()
        }
      }
    })

    socket.addEventListener("close", () => {
      if (socketRef.current !== socket) return
      socketRef.current = null

      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current)
        closeTimeoutRef.current = null
      }
    })

    socket.addEventListener("error", () => {
      if (socketRef.current !== socket) return
      socket.close()
    })
  }

  useEffect(() => cleanupNotificationSocket, [])

  const handleConfirm = async () => {
    const parsed = loginSchema.pick({ email: true }).safeParse({ email: getEmail() })
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid email")
      return
    }

    if (!apiUrl) {
      toast.error("API URL is missing")
      return
    }

    try {
      setLoading(true)
      const correlationId = crypto.randomUUID()
      const { data, error } = await authClient.requestPasswordReset({
        email: parsed.data.email,
        redirectTo: `${import.meta.env.VITE_APP_URL}/reset-password`,
        fetchOptions: {
          headers: {
            [NOTIFICATION_CORRELATION_ID_HEADER]: correlationId
          }
        }
      })
      if (error) return void toast.error(error.message ?? error.statusText)
      if (data) toast.info(data.message)
      openNotificationSocket(correlationId)
      setSent(true)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoaderCircle className="animate-spin" />
  }

  if (sent) {
    return (
      <div className="flex items-center gap-2 justify-center opacity-65 text-sm">
        <CheckCircle className="text-green-500" />
        <span>Email sent</span>
      </div>
    )
  }

  return (
    <ConfirmDialog
      title="Forgot Password?"
      description="An email will be sent to you with a link to reset your password."
      confirm="Send Email"
      onConfirm={handleConfirm}
      confirmClassName="text-green-500"
    >
      {children}
    </ConfirmDialog>
  )
}
