import { getTimeAgo } from "@app/shared"
import { createFileRoute } from "@tanstack/react-router"
import { createColumnHelper } from "@tanstack/react-table"
import type { UserWithRole } from "better-auth/client/plugins"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Table } from "#/components/Table"
import { Loader } from "#/components/ui/Loader"
import { Main } from "#/components/ui/Main"
import { MainSection } from "#/components/ui/MainSection"
import { useAuthClient } from "#/hooks/auth-client"

export const Route = createFileRoute("/users")({
  component: UserList
})

const columnHelper =
  createColumnHelper<Pick<UserWithRole, "id" | "name" | "email" | "emailVerified" | "image" | "role" | "createdAt">>()
const columns = [
  columnHelper.accessor("name", {
    header: () => "Name",
    cell: info => info.getValue()
  }),
  columnHelper.accessor("email", {
    header: () => "Email",
    cell: info => info.getValue()
  }),
  columnHelper.accessor("emailVerified", {
    header: () => "Verified",
    cell: info => (info.getValue() ? "Yes" : "No")
  }),
  columnHelper.accessor("image", {
    header: () => "Image",
    cell: info => info.getValue()
  }),
  columnHelper.accessor("role", {
    header: () => "Role",
    cell: info => info.getValue()
  }),
  columnHelper.accessor("createdAt", {
    header: () => "Registered",
    cell: info => getTimeAgo(info.getValue())
  })
]

export function UserList() {
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [loading, setLoading] = useState(false)
  const { admin } = useAuthClient()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const { data, error } = await admin.listUsers({
        query: {}
      })
      setLoading(false)
      if (error) {
        toast.error(error.message)
      }
      if (data) {
        setUsers(data.users)
      }
    })()
  }, [])

  if (loading) return <Loader />
  if (!users || users.length === 0) return null

  return (
    <Main>
      <MainSection>
        <h1>Users</h1>
        <Table rows={users} columns={columns} />
      </MainSection>
    </Main>
  )
}
