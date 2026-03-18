import { getDateTime } from "@app/shared"
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
import { Table } from "../Table"
import { ConfirmDialog } from "../ui/ConfirmDialog"

const columnHelper = createColumnHelper<SessionWithImpersonatedBy>()

const columns = [
  columnHelper.accessor("ipAddress", {
    header: () => "IP",
    cell: info => info.getValue()
  }),
  columnHelper.accessor("userAgent", {
    header: () => "User Agent",
    cell: info => (
      <pre className="w-56! max-h-32 overflow-auto">{JSON.stringify(UAParser(info.getValue() || "{}"), null, 2)}</pre>
    )
  }),
  columnHelper.accessor("createdAt", {
    header: () => "Created",
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
    setSessions(data?.data?.sessions)
  }, [data])

  useEffect(() => {
    toast.error(error?.message)
  }, [error])

  return (
    <Section className={className}>
      <h2 className="m-0">Sessions</h2>

      <ConfirmDialog title="Are you sure?" onConfirm={() => mutate()}>
        <Button size="lg" className="my-4">
          <MonitorX className="mr-4" /> Revoke All Sessions
        </Button>
      </ConfirmDialog>

      {sessions && <Table rows={sessions} columns={columns} />}
    </Section>
  )
}
