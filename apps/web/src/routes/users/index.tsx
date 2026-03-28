import { getTimeAgo } from "@app/shared"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { createColumnHelper } from "@tanstack/react-table"
import type { UserWithRole } from "better-auth/client/plugins"
import { Check, PersonStanding, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Loader } from "#/components/ui/Loader"
import { Main } from "#/components/ui/Main"
import { Section } from "#/components/ui/Section"
import { Table } from "#/components/ui/Table"
import { useAuthClient } from "#/hooks/auth-client"
import { userRequired } from "#/lib/loaders"

export const Route = createFileRoute("/users/")({
  component: UserList,
  loader: () => userRequired("admin")
})

type UsersColumns = Pick<UserWithRole, "id" | "name" | "email" | "emailVerified" | "role" | "createdAt">
const columnHelper = createColumnHelper<UsersColumns>()

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: info => <a href={`mailto:${info.row.original.email}`}>{info.getValue()}</a>
  }),
  columnHelper.accessor("emailVerified", {
    header: "Verified",
    cell: info =>
      info.row.original.emailVerified ? <Check aria-label="Yes" /> : <X className="opacity-50" aria-label="No" />,
    enableColumnFilter: false
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: info => <div className="font-mono text-sm">{info.getValue()}</div>,
    meta: {
      filterVariant: "role"
    }
  }),
  columnHelper.accessor("createdAt", {
    header: "Registered",
    cell: info => getTimeAgo(info.getValue()),
    meta: {
      filterVariant: "period"
    },
    filterFn: (row, columnId: string, filterValue: [Date | undefined, Date | undefined]) => {
      const currentDate = row.original[columnId as keyof UsersColumns] as Date
      return !((filterValue[0] && filterValue[0] > currentDate) || (filterValue[1] && filterValue[1] < currentDate))
    }
  }),
  {
    id: "link",
    cell: (info: { row: { original: { id: string } } }) => (
      <Link to="/users/$userId" params={{ userId: info.row.original.id }} className="flex text-sm items-center gap-0.5">
        <PersonStanding />
        Details
      </Link>
    )
  }
]

function UserList() {
  const [users, setUsers] = useState<UserWithRole[]>([])
  const { admin } = useAuthClient()

  const { data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await admin.listUsers({ query: {} })
      if (error) throw new Error(error.message)
      return data.users
    }
  })

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setUsers(data)
    }
  }, [data])

  if (isLoading) return <Loader />
  if (!users || users.length === 0) return null

  return (
    <Main>
      <Section>
        <h1 className="text-center">Users</h1>
        <Table data={users} columns={columns} />
      </Section>
    </Main>
  )
}
