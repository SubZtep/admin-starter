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

  return (
    <div>
      <h2>Users</h2>
      <Table rows={users} columns={columns} />
      {/* <pre>{JSON.stringify(users, null, 2)}</pre> */}
    </div>
  )
}

function is(interval: number, cycle: number) {
  return cycle >= interval ? Math.floor(cycle / interval) : 0
}

function getTimeAgo(time: string | number | Date, now = Date.now()) {
  if (typeof time === "string" || time instanceof Date) {
    time = new Date(time).getTime()
  }

  const secs = (now - time) / 1000
  const mins = is(60, secs)
  const hours = is(60, mins)
  const days = is(24, hours)
  const weeks = is(7, days)
  const months = is(30, days)
  const years = is(12, months)

  let amount = years
  let cycle = "year"

  if (secs <= 1) {
    return "just now"
  }
  if (years > 0) {
    amount = years
    cycle = "year"
  } else if (months > 0) {
    amount = months
    cycle = "month"
  } else if (weeks > 0) {
    amount = weeks
    cycle = "week"
  } else if (days > 0) {
    amount = days
    cycle = "day"
  } else if (hours > 0) {
    amount = hours
    cycle = "hour"
  } else if (mins > 0) {
    amount = mins
    cycle = "minute"
  } else {
    amount = secs
    cycle = "second"
  }

  const v = Math.floor(amount)

  return `${v === 1 ? (amount === hours ? "an" : "a") : v} ${cycle}${v > 1 ? "s" : ""} ago`
}
