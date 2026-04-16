import { Link } from "@tanstack/react-router"
import { LayoutDashboard, Shield, Users } from "lucide-react"

const mobileNavItems = [
  { to: "/dashboard", label: "Dash", icon: LayoutDashboard },
  { to: "/users", label: "Users", icon: Users },
  { to: "/profile", label: "Profile", icon: Shield }
] as const

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950 border-t border-slate-900/50 h-16 flex items-center justify-around z-50 px-6">
      {mobileNavItems.map(item => (
        <Link
          key={item.to}
          to={item.to}
          className="flex flex-col items-center gap-1 text-slate-400"
          activeProps={{ className: "text-teal-400" }}
        >
          <item.icon size={20} />
          <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}
