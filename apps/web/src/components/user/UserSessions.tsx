import { getDateTime, getTimeAgo } from "@app/shared"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import type { SessionWithImpersonatedBy } from "better-auth/plugins"
import { MonitorX } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { UAParser } from "ua-parser-js"
import { Section } from "#/components/ui/Section"
import { useAuthClient } from "#/hooks/auth-client"
import { queryClient } from "#/lib/query"
import { Button } from "../form/primitives/Button"
import { ConfirmDialog } from "../ui/ConfirmDialog"
import { Table } from "../ui/Table"

const columnHelper = createColumnHelper<SessionWithImpersonatedBy>()

const columns = [
  columnHelper.accessor("ipAddress", {
    header: "IP",
    cell: info => info.getValue()
  }),
  columnHelper.accessor("userAgent", {
    header: "User Agent",
    cell: info => (
      <pre className="w-56! max-h-32 overflow-auto">{JSON.stringify(UAParser(info.getValue() || "{}"), null, 2)}</pre>
    )
  }),
  columnHelper.accessor("createdAt", {
    header: "Created",
    cell: info => getTimeAgo(info.getValue()),
    enableColumnFilter: false
  }),
  columnHelper.accessor("expiresAt", {
    header: "Expires",
    cell: info => getDateTime(info.getValue(), "short"),
    enableColumnFilter: false
  })
]

export function UserSessions({ userId, className }: Readonly<{ userId: string; className?: string }>) {
  const authClient = useAuthClient()
  const [sessions, setSessions] = useState<SessionWithImpersonatedBy[]>()

  const { data, error, refetch } = useQuery({
    queryKey: ["userSessions", userId],
    queryFn: () => authClient.admin.listUserSessions({ userId })
  })

  const { mutate } = useMutation({
    mutationFn: () => authClient.admin.revokeUserSessions({ userId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userSessions", userId] })
      await refetch()
    }
  })

  useEffect(() => {
    if (data?.data?.sessions && Array.isArray(data.data.sessions)) {
      setSessions(data.data.sessions)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  return (
    <Section className={className}>
      <h2 className="m-0">Sessions</h2>

      <ConfirmDialog title="Are you sure?" onConfirm={() => mutate()}>
        <Button size="lg" className="my-4" disabled={sessions?.length === 0}>
          <MonitorX className="mr-4" /> Revoke All Sessions
        </Button>
      </ConfirmDialog>

      {sessions && <Table data={sessions} columns={columns} />}
    </Section>
  )
}
