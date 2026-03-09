import { Link } from "@tanstack/react-router"
import type React from "react"

export function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="nav-link" activeProps={{ className: "nav-link is-active" }}>
      {children}
    </Link>
  )
}
