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
  admin: "text-tertiary-fixed-dim bg-tertiary-container/50",
  superuser: "text-tertiary-fixed-dim bg-tertiary-container/50",
  user: "text-on-surface-variant bg-surface-container/50",
  editor: "text-on-surface-variant bg-surface-container/50",
  viewer: "text-on-surface-variant bg-surface-container/50"
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
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                {user.image ? (
                  <img alt={user.name ?? ""} className="w-full h-full object-cover rounded-lg" src={user.image} />
                ) : (
                  <span className="text-sm font-bold text-primary">{initials}</span>
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-on-surface">{info.getValue()}</div>
                <div className="text-xs text-on-surface-variant">{user.email}</div>
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
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(60,221,199,0.6)]" />
                <span className="text-xs text-on-surface-variant">Authenticated</span>
              </div>
            )
          }
          return (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
              <span className="text-xs text-on-surface-variant">Pending</span>
            </div>
          )
        },
        enableColumnFilter: false
      }),
      columnHelper.accessor("createdAt", {
        header: "Last Sync",
        cell: info => <span className="font-mono text-xs text-on-surface-variant">{getTimeAgo(info.getValue())}</span>,
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
              className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-all inline-flex"
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
          <h2 className="text-5xl font-bold font-headline tracking-tighter text-on-surface mb-4 my-0">
            User Directory
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg">
            Manage your organization's digital identity hierarchy and access controls.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface-container-low p-6 rounded-xl border-t-2 border-primary min-w-[160px]">
            <p className="text-on-surface-variant font-bold uppercase tracking-widest text-[10px] mb-1">Total Users</p>
            <p className="text-3xl font-bold font-headline text-primary">{users.length.toLocaleString()}</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl border-t-2 border-tertiary min-w-[160px]">
            <p className="text-on-surface-variant font-bold uppercase tracking-widest text-[10px] mb-1">Verified</p>
            <p className="text-3xl font-bold font-headline text-tertiary">{activeCount}</p>
          </div>
        </div>
      </header>

      <section className="bg-surface-container-low rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 bg-surface-container flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[280px] relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-high border-none rounded-lg py-3 pl-12 pr-4 text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-on-surface-variant uppercase tracking-tighter mr-2">Filters:</span>
            {roleFilter ? (
              <button
                type="button"
                onClick={() => setRoleFilter("")}
                className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 hover:brightness-110 transition-all"
              >
                Role: {capitalized(roleFilter)} <X size={12} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setRoleFilter("admin")}
                  className="bg-surface-container-highest text-on-surface-variant px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 hover:text-on-surface transition-all"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRoleFilter("user")}
                  className="bg-surface-container-highest text-on-surface-variant px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 hover:text-on-surface transition-all"
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
                className="ml-2 text-primary font-bold text-xs uppercase tracking-widest hover:underline"
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
                  className="bg-surface-container-lowest text-on-surface-variant uppercase text-[10px] tracking-[0.2em] font-bold"
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
                <tr
                  key={row.id}
                  className="group hover:bg-surface-container-highest transition-colors duration-150 cursor-pointer"
                >
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

      <footer className="mt-12 flex flex-col sm:flex-row justify-between items-center text-on-surface-variant text-[10px] uppercase tracking-widest font-bold gap-4">
        <div>
          Showing {filteredCount} of {users.length} users
        </div>
      </footer>
    </>
  )
}
