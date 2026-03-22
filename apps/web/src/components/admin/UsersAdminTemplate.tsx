import { getDateTime } from "@app/shared"
import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { Loader } from "#/components/ui/Loader"
import { useAuthClient } from "#/hooks/auth-client"

function roleBadgeClass(role?: string) {
  if (role === "admin") return "bg-primary/10 text-primary border border-primary/20"
  // Default styling for "user"/unknown roles
  return "bg-surface-container-high/50 text-on-surface-variant border border-outline-variant/30"
}

function roleLabel(role?: string) {
  if (!role) return "Unknown"
  if (role === "admin") return "Administrator"
  return role.charAt(0).toUpperCase() + role.slice(1)
}

export function UsersAdminTemplate() {
  const authClient = useAuthClient()

  const { data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          limit: 10_000
        }
      })

      if (error) throw new Error(error.message)
      return data
    }
  })

  useEffect(() => {
    if (!error) return
    toast.error(error.message)
  }, [error])

  if (isLoading) return <Loader />

  const users = data?.users ?? []
  const total = data?.total ?? 0

  return (
    <div className="font-body selection:bg-primary/30 selection:text-primary overflow-x-hidden min-h-dvh bg-surface">
      {/* Sidebar Navigation (Fixed Left) */}
      <aside className="hidden md:flex flex-col py-6 gap-4 h-screen w-64 fixed left-0 top-0 bg-[#070d19] z-50 border-r border-outline-variant/30">
        <div className="px-6 mb-8">
          <h1 className="text-lg font-manrope font-bold text-[#3cddc7]">Admin Console</h1>
          <p className="text-xs text-slate-500 font-medium">System Root</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-[#111a2e] transition-colors font-inter text-sm font-medium rounded-lg"
          >
            <span className="material-symbols-outlined" data-icon="dashboard">
              dashboard
            </span>
            <span>Overview</span>
          </Link>

          <Link
            to="/users"
            className="flex items-center gap-3 px-4 py-3 bg-[#162033] text-[#3cddc7] rounded-lg border-l-4 border-[#3cddc7] font-inter text-sm font-medium transition-all translate-x-1 duration-200"
          >
            <span className="material-symbols-outlined" data-icon="group">
              group
            </span>
            <span>User Directory</span>
          </Link>

          <Link
            to="/users"
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-[#111a2e] transition-colors font-inter text-sm font-medium rounded-lg"
          >
            <span className="material-symbols-outlined" data-icon="lock">
              lock
            </span>
            <span>Access Control</span>
          </Link>

          <Link
            to="/users"
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-[#111a2e] transition-colors font-inter text-sm font-medium rounded-lg"
          >
            <span className="material-symbols-outlined" data-icon="history">
              history
            </span>
            <span>Audit Logs</span>
          </Link>

          <Link
            to="/users"
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-300 hover:bg-[#111a2e] transition-colors font-inter text-sm font-medium rounded-lg"
          >
            <span className="material-symbols-outlined" data-icon="analytics">
              analytics
            </span>
            <span>System Health</span>
          </Link>
        </nav>

        <div className="mt-auto px-4 pb-4 space-y-4">
          <button
            type="button"
            className="w-full bg-primary text-on-primary py-2.5 rounded-lg font-bold text-sm hover:opacity-90 active:scale-95 transition-all"
          >
            Invite Member
          </button>

          <div className="border-t border-slate-800 pt-4">
            <button type="button" className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-300 font-inter text-sm font-medium">
              <span className="material-symbols-outlined" data-icon="contact_support">
                contact_support
              </span>
              <span>Support</span>
            </button>
            <button type="button" className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-300 font-inter text-sm font-medium">
              <span className="material-symbols-outlined" data-icon="logout">
                logout
              </span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Shell */}
      <main className="md:ml-64 min-h-screen bg-surface">
        {/* Top Navigation Bar (Fixed Top) */}
        <header className="flex justify-between items-center px-8 h-16 w-full sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold text-[#3cddc7] tracking-tight font-manrope">Obsidian Admin</span>
            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/dashboard" className="text-slate-400 hover:text-slate-200 transition-colors font-manrope font-semibold text-sm">
                Dashboard
              </Link>
              <Link
                to="/users"
                className="text-[#3cddc7] border-b-2 border-[#3cddc7] py-5 font-manrope font-semibold text-sm"
              >
                Users
              </Link>
              <Link to="/dashboard" className="text-slate-400 hover:text-slate-200 transition-colors font-manrope font-semibold text-sm">
                Reports
              </Link>
              <Link to="/dashboard" className="text-slate-400 hover:text-slate-200 transition-colors font-manrope font-semibold text-sm">
                Settings
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button type="button" className="p-2 text-slate-400 hover:bg-surface-container-high rounded-lg transition-all active:scale-95">
              <span className="material-symbols-outlined" data-icon="notifications">
                notifications
              </span>
            </button>
            <button type="button" className="p-2 text-slate-400 hover:bg-surface-container-high rounded-lg transition-all active:scale-95">
              <span className="material-symbols-outlined" data-icon="help">
                help
              </span>
            </button>

            <div className="w-9 h-9 rounded-lg overflow-hidden border border-primary/20 bg-slate-800 ml-2" />
          </div>
        </header>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-8 py-10">
          {/* Page Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
            <div className="space-y-1">
              <h2 className="text-3xl font-manrope font-extrabold text-on-surface tracking-tight">User Directory</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-full border border-outline-variant/30">
                  Total Users: {total.toLocaleString()}
                </span>
                <span className="text-xs text-primary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs" data-icon="trending_up">
                    trending_up
                  </span>
                  +432 this month
                </span>
              </div>
            </div>
          </div>

          {/* Filters & Search (UI only; not wired to server-side filtering) */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative w-full sm:w-[320px]">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg" data-icon="search">
                search
              </span>
              <input
                className="w-full bg-surface-container border border-outline-variant/50 rounded-lg pl-11 pr-4 py-2.5 text-sm text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-outline"
                placeholder="Search name, email, or role..."
                type="text"
              />
            </div>

            <div className="relative">
              <select className="appearance-none bg-surface-container border border-outline-variant/50 rounded-lg pl-4 pr-10 py-2.5 text-sm text-on-surface focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer min-w-[140px]">
                <option>All Roles</option>
                <option>Administrator</option>
                <option>Superuser</option>
                <option>Editor</option>
                <option>Viewer</option>
              </select>
              <span
                className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                data-icon="expand_more"
              >
                expand_more
              </span>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 bg-surface-container border border-outline-variant/50 text-on-surface px-4 py-2.5 rounded-lg text-sm font-semibold hover:border-primary transition-all"
            >
              <span className="material-symbols-outlined text-lg text-primary" data-icon="calendar_today">
                calendar_today
              </span>
              Registered Date
            </button>
          </div>

          {/* Data Table Container */}
          <div className="bg-[#111a2e] rounded-xl overflow-hidden border border-outline-variant/30 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high/50 border-b border-outline-variant/50">
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                      Name &amp; Identity
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
                      Registered Date
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-outline-variant/20">
                  {users.map(user => {
                    const avatarLetter = (user.name?.trim()?.[0] ?? user.email?.trim()?.[0] ?? "?").toUpperCase()
                    return (
                      <tr key={user.id} className="table-row-hover transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 flex items-center justify-center">
                              <span className="text-sm font-bold text-on-surface-variant">{avatarLetter}</span>
                            </div>
                            <span className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${roleBadgeClass(user.role)} `}>
                            {roleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`material-symbols-outlined text-xl ${user.emailVerified ? "text-primary" : "text-outline"}`}
                            data-icon={user.emailVerified ? "verified" : "pending"}
                          >
                            {user.emailVerified ? "verified" : "pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">{getDateTime(user.createdAt, "medium")}</td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to="/users/$userId"
                            params={{ userId: user.id }}
                            className="p-2 hover:bg-surface-container-high rounded-lg transition-all text-on-surface-variant inline-flex items-center justify-center"
                            aria-label={`View ${user.name}`}
                          >
                            <span className="material-symbols-outlined text-xl" data-icon="more_vert">
                              more_vert
                            </span>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="flex items-center justify-between mt-6 px-2">
            <p className="text-xs font-medium text-on-surface-variant">
              Showing <span className="text-primary font-bold">{users.length}</span> of {total.toLocaleString()} users
            </p>
          </div>
        </div>
      </main>

      {/* Mobile Navigation (Bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#070d19] border-t border-outline-variant/30 h-16 flex items-center justify-around z-50 px-6">
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-slate-500">
          <span className="material-symbols-outlined" data-icon="dashboard">
            dashboard
          </span>
          <span className="text-[10px] font-bold uppercase tracking-tight">Dash</span>
        </Link>
        <Link to="/users" className="flex flex-col items-center gap-1 text-[#3cddc7]">
          <span className="material-symbols-outlined" data-icon="group">
            group
          </span>
          <span className="text-[10px] font-bold uppercase tracking-tight">Users</span>
        </Link>
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-slate-500">
          <span className="material-symbols-outlined" data-icon="history">
            history
          </span>
          <span className="text-[10px] font-bold uppercase tracking-tight">Audit</span>
        </Link>
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-slate-500">
          <span className="material-symbols-outlined" data-icon="settings">
            settings
          </span>
          <span className="text-[10px] font-bold uppercase tracking-tight">System</span>
        </Link>
      </nav>
    </div>
  )
}

