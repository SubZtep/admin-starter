import { getDateTime } from "@app/shared"
import { createFileRoute, Link, useParams } from "@tanstack/react-router"
import type { UserWithRole } from "better-auth/plugins"
import { ArrowLeft, Calendar, CheckCircle2, Clock, Mail, Shield } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Loader } from "#/components/ui/Loader"
import { UserSessions } from "#/components/user/UserSessions"
import { useAuthClient } from "#/hooks/auth-client"
import { userRequired } from "#/lib/loaders"

export const Route = createFileRoute("/_admin/users/$userId")({
  component: UserPageComponent,
  loader: () => userRequired("admin")
})

function UserPageComponent() {
  const { userId } = useParams({ from: "/_admin/users/$userId" })
  const authClient = useAuthClient()
  const [user, setUser] = useState<UserWithRole>()

  useEffect(() => {
    void (async () => {
      const { data, error } = await authClient.admin.getUser({ query: { id: userId } })
      if (error) toast.error(error.message)
      if (data) setUser(data)
    })()
  }, [])

  if (!user) return <Loader />

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          to="/users"
          className="p-2 hover:bg-surface-container-high rounded-lg transition-all text-on-surface-variant"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="space-y-1">
          <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight my-0">{user.name}</h2>
          <p className="text-sm text-on-surface-variant">User Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container rounded-xl border border-outline-variant/30 p-6 space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container-high flex items-center justify-center flex-shrink-0">
              {user.image ? (
                <img alt={user.name ?? ""} className="w-full h-full object-cover" src={user.image} />
              ) : (
                <span className="text-2xl font-bold text-primary">{user.name?.charAt(0)?.toUpperCase() ?? "?"}</span>
              )}
            </div>
            <div>
              <h3 className="font-headline font-bold text-on-surface text-lg">{user.name}</h3>
              <span className="text-sm text-on-surface-variant">{user.email}</span>
            </div>
          </div>

          <div className="space-y-3 border-t border-outline-variant/30 pt-4">
            <DetailRow icon={Mail} label="Email" value={user.email} />
            <DetailRow
              icon={user.emailVerified ? CheckCircle2 : Clock}
              label="Verification"
              value={user.emailVerified ? "Verified" : "Pending"}
            />
            <DetailRow icon={Shield} label="Role" value={user.role ?? "user"} />
            <DetailRow icon={Calendar} label="Created" value={getDateTime(user.createdAt, "long")} />
          </div>
        </div>

        <div className="bg-surface-container rounded-xl border border-outline-variant/30 p-6">
          <UserSessions userId={userId} />
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value
}: Readonly<{
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: string
}>) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={16} className="text-on-surface-variant flex-shrink-0" />
      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest w-24">{label}</span>
      <span className="text-sm text-on-surface">{value}</span>
    </div>
  )
}
