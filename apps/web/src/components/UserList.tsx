import { getTimeAgo } from "@app/shared"
import { createColumnHelper } from "@tanstack/react-table"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { authClient } from "#/lib/auth"
import Table from "./Table"

type UserRow = {
  id: string
  name: string
  email: string
  image: string
  role: string | null
  createdAt: string
}

const columnHelper = createColumnHelper<UserRow>()
const columns = [
  columnHelper.accessor("name", {
    header: () => "Name",
    cell: info => info.getValue()
  }),
  columnHelper.accessor("email", {
    header: () => "Email",
    cell: info => info.getValue()
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
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    ;(async () => {
      const { data, error } = await authClient.admin.listUsers({
        query: {}
      })
      if (error) {
        toast.error(error.message)
      }
      if (data) {
        setUsers(data.users)
      }
    })()
  }, [])

  if (!users || users.length === 0) {
    return null
  }

  return (
    <div>
      <h2>Users</h2>
      <Table rows={users} columns={columns} />
      {/* <pre>{JSON.stringify(users, null, 2)}</pre> */}
    </div>
  )
}
