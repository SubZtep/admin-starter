import { getFirstName } from "@app/shared"
import { createFileRoute } from "@tanstack/react-router"
import { Activity, TrendingUp, UserCheck, Users } from "lucide-react"
import { useUser } from "#/hooks/user"

export const Route = createFileRoute("/_admin/dashboard")({
  component: DashboardPage
})

function DashboardPage() {
  const user = useUser()

  return (
    <>
      <header className="mb-12">
        <h2 className="text-5xl font-bold font-headline tracking-tighter text-on-surface mb-4 my-0">
          Welcome back{user ? `, ${getFirstName(user.name)}` : ""}
        </h2>
        <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg">
          Here's what's happening with your platform today.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Users} label="Total Users" value="--" accent="primary" />
        <StatCard icon={UserCheck} label="Verified" value="--" accent="tertiary" />
        <StatCard icon={Activity} label="System Health" value="99.9%" accent="primary" />
        <StatCard icon={TrendingUp} label="Growth Rate" value="--" accent="tertiary" />
      </div>

      <section className="bg-surface-container-low rounded-2xl p-8 shadow-2xl">
        <h3 className="font-headline font-bold text-on-surface mb-2 text-lg">Quick Actions</h3>
        <p className="text-on-surface-variant leading-relaxed">
          Navigate to the User Directory to manage users, or check your Profile settings.
        </p>
      </section>
    </>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent
}: Readonly<{
  icon: React.ComponentType<{ size?: number }>
  label: string
  value: string
  accent: "primary" | "tertiary"
}>) {
  const borderClass = accent === "primary" ? "border-primary" : "border-tertiary"
  const valueClass = accent === "primary" ? "text-primary" : "text-tertiary"

  return (
    <div className={`bg-surface-container-low p-6 rounded-xl border-t-2 ${borderClass}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-on-surface-variant font-bold uppercase tracking-widest text-[10px]">{label}</p>
        <Icon size={16} className={valueClass} />
      </div>
      <p className={`text-3xl font-bold font-headline ${valueClass}`}>{value}</p>
    </div>
  )
}
