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
        <h2 className="my-0 mb-4 text-5xl font-headline font-bold tracking-tighter text-slate-100">
          Welcome back{user ? `, ${getFirstName(user.name)}` : ""}
        </h2>
        <p className="max-w-lg text-lg leading-relaxed text-slate-400">
          Here's what's happening with your platform today.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Users} label="Total Users" value="--" accent="primary" />
        <StatCard icon={UserCheck} label="Verified" value="--" accent="tertiary" />
        <StatCard icon={Activity} label="System Health" value="99.9%" accent="primary" />
        <StatCard icon={TrendingUp} label="Growth Rate" value="--" accent="tertiary" />
      </div>

      <section className="rounded-2xl bg-slate-900 p-8 shadow-2xl">
        <h3 className="mb-2 text-lg font-headline font-bold text-slate-100">Quick Actions</h3>
        <p className="leading-relaxed text-slate-400">
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
  const borderClass = accent === "primary" ? "border-teal-400" : "border-sky-300"
  const valueClass = accent === "primary" ? "text-teal-400" : "text-sky-300"

  return (
    <div className={`rounded-xl border-t-2 bg-slate-900 p-6 ${borderClass}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <Icon size={16} className={valueClass} />
      </div>
      <p className={`text-3xl font-bold font-headline ${valueClass}`}>{value}</p>
    </div>
  )
}
