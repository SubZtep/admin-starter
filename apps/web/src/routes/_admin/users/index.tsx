import { capitalized, getTimeAgo } from "@app/shared"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
  type ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"
import type { UserWithRole } from "better-auth/client/plugins"
import { ArrowDown, ArrowUp, Eye, Search, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { Loader } from "#/components/ui/Loader"
import { useAuthClient } from "#/hooks/auth-client"
import { userRequired } from "#/lib/loaders"

export const Route = createFileRoute("/_admin/users/")({
  component: UserList,
  loader: () => userRequired("admin")
})

type UsersColumns = Pick<UserWithRole, "id" | "name" | "email" | "emailVerified" | "role" | "createdAt" | "image">
const columnHelper = createColumnHelper<UsersColumns>()

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-sky-950/50 text-sky-300",
  superuser: "bg-sky-950/50 text-sky-300",
  user: "bg-slate-900/50 text-slate-400",
  editor: "bg-slate-900/50 text-slate-400",
  viewer: "bg-slate-900/50 text-slate-400"
}

function UserList() {
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
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
    if (error) toast.error(error.message)
  }, [error])

  useEffect(() => {
    if (data && Array.isArray(data)) setUsers(data)
  }, [data])

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "User Identity",
        cell: info => {
          const user = info.row.original
          const initials = (user.name ?? "?")
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
          return (
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                {user.image ? (
                  <img alt={user.name ?? ""} className="w-full h-full object-cover rounded-lg" src={user.image} />
                ) : (
                  <span className="text-sm font-bold text-teal-400">{initials}</span>
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-100">{info.getValue()}</div>
                <div className="text-xs text-slate-400">{user.email}</div>
              </div>
            </div>
          )
        }
      }),
      columnHelper.accessor("role", {
        header: "Access Level",
        cell: info => {
          const role = info.getValue() ?? "user"
          const style = ROLE_STYLES[role] ?? ROLE_STYLES.user
          return <span className={`text-xs font-medium px-3 py-1 rounded ${style}`}>{capitalized(role)}</span>
        },
        enableColumnFilter: false
      }),
      columnHelper.accessor("emailVerified", {
        header: "Status",
        cell: info => {
          const verified = info.getValue()
          if (verified) {
            return (
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
                <span className="text-xs text-slate-400">Authenticated</span>
              </div>
            )
          }
          return (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />
              <span className="text-xs text-slate-400">Pending</span>
            </div>
          )
        },
        enableColumnFilter: false
      }),
      columnHelper.accessor("createdAt", {
        header: "Last Sync",
        cell: info => <span className="font-mono text-xs text-slate-400">{getTimeAgo(info.getValue())}</span>,
        enableColumnFilter: false
      }),
      {
        id: "actions",
        header: "",
        cell: (info: { row: { original: { id: string } } }) => (
          <div className="text-right">
            <Link
              to="/users/$userId"
              params={{ userId: info.row.original.id }}
              className="inline-flex rounded-lg p-2 text-teal-400 transition-all hover:bg-teal-400/10"
            >
              <Eye size={18} />
            </Link>
          </div>
        )
      }
    ],
    []
  )

  const table = useReactTable({
    columns,
    data: users,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: "createdAt", desc: true }]
    },
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      const name = (row.original.name ?? "").toLowerCase()
      const email = (row.original.email ?? "").toLowerCase()
      const role = (row.original.role ?? "").toLowerCase()
      return name.includes(search) || email.includes(search) || role.includes(search)
    }
  })

  useEffect(() => {
    table.setGlobalFilter(searchQuery)
  }, [searchQuery, table])

  useEffect(() => {
    if (roleFilter) {
      setColumnFilters([{ id: "role", value: roleFilter }])
    } else {
      setColumnFilters([])
    }
  }, [roleFilter])

  if (isLoading) return <Loader />
  if (!users || users.length === 0) return null

  const filteredCount = table.getRowModel().rows.length
  const activeCount = users.filter(u => u.emailVerified).length

  return (
    <>
      <header className="mb-12 flex flex-col lg:flex-row justify-between lg:items-end gap-8">
        <div className="max-w-2xl">
          <h2 className="my-0 mb-4 text-5xl font-headline font-bold tracking-tighter text-slate-100">User Directory</h2>
          <p className="max-w-lg text-lg leading-relaxed text-slate-400">
            Manage your organization's digital identity hierarchy and access controls.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="min-w-[160px] rounded-xl border-t-2 border-teal-400 bg-slate-900 p-6">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Users</p>
            <p className="text-3xl font-headline font-bold text-teal-400">{users.length.toLocaleString()}</p>
          </div>
          <div className="min-w-[160px] rounded-xl border-t-2 border-sky-300 bg-slate-900 p-6">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Verified</p>
            <p className="text-3xl font-headline font-bold text-sky-300">{activeCount}</p>
          </div>
        </div>
      </header>

      <section className="overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
        <div className="flex flex-wrap items-center gap-4 bg-slate-900 px-6 py-6">
          <div className="flex-1 min-w-[280px] relative">
            <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-slate-800 py-3 pr-4 pl-12 text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:ring-1 focus:ring-teal-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-2 text-sm font-bold uppercase tracking-tighter text-slate-400">Filters:</span>
            {roleFilter ? (
              <button
                type="button"
                onClick={() => setRoleFilter("")}
                className="flex items-center gap-2 rounded-full bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-100 transition-all hover:brightness-110"
              >
                Role: {capitalized(roleFilter)} <X size={12} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setRoleFilter("admin")}
                  className="flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 transition-all hover:text-slate-100"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRoleFilter("user")}
                  className="flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 transition-all hover:text-slate-100"
                >
                  User
                </button>
              </>
            )}
            {(searchQuery || roleFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("")
                  setRoleFilter("")
                }}
                className="ml-2 text-xs font-bold uppercase tracking-widest text-teal-400 hover:underline"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr
                  key={headerGroup.id}
                  className="bg-slate-950 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400"
                >
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className={`px-8 py-4 ${header.id === "createdAt" ? "text-right" : ""}`}
                      onClick={() =>
                        header.column.getCanSort() && header.column.toggleSorting(header.column.getIsSorted() === "asc")
                      }
                      style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                    >
                      <span className="flex items-center gap-1">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: <ArrowUp size={10} />, desc: <ArrowDown size={10} /> }[
                          header.column.getIsSorted() as string
                        ] ?? null}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-white/5">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="group cursor-pointer transition-colors duration-150 hover:bg-slate-800">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className={`px-8 py-5 ${cell.column.id === "createdAt" ? "text-right" : ""}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mt-12 flex flex-col items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:flex-row sm:justify-between">
        <div>
          Showing {filteredCount} of {users.length} users
        </div>
      </footer>
    </>
  )
}
