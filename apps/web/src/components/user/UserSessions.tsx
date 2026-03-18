import { getDateTime } from "@app/shared"
import { createColumnHelper } from "@tanstack/react-table"
import type { SessionWithImpersonatedBy } from "better-auth/plugins"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Section } from "#/components/ui/Section"
import { useAuthClient } from "#/hooks/auth-client"
import { Table } from "../Table"

const columnHelper = createColumnHelper<SessionWithImpersonatedBy>()

const columns = [
  columnHelper.accessor("ipAddress", {
    header: () => "IP",
    cell: info => info.getValue()
  }),
  columnHelper.accessor("userAgent", {
    header: () => "User Agent",
    cell: info => info.getValue()
  }),
  columnHelper.accessor("createdAt", {
    header: () => "Created",
    cell: info => getDateTime(info.getValue(), "short")
  }),
  columnHelper.accessor("updatedAt", {
    header: () => "Updated",
    cell: info => getDateTime(info.getValue(), "short")
  }),
  columnHelper.accessor("expiresAt", {
    header: () => "Expires",
    cell: info => getDateTime(info.getValue(), "short")
  })
]

export function UserSessions({ userId, className }: Readonly<{ userId: string; className?: string }>) {
  const authClient = useAuthClient()
  const [sessions, setSessions] = useState<SessionWithImpersonatedBy[]>()

  useEffect(() => {
    void (async () => {
      const { data, error } = await authClient.admin.listUserSessions({ userId })
      if (error) toast.error(error.message)
      if (data) setSessions(data.sessions)
    })()
  }, [])

  if (!sessions) {
    return null
  }

  return (
    <Section className={className}>
      <h2 className="m-0">Sessions</h2>
      <Table rows={sessions} columns={columns} />
    </Section>
  )
}
