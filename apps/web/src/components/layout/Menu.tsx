import { useProgress } from "@bprogress/react"
import { Link, useNavigate } from "@tanstack/react-router"
import { type CSSProperties, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useAuthClient } from "#/hooks/auth-client"
import { ConfirmDialog } from "../ui/ConfirmDialog"

const menuItems: {
  to: string
  label: string
  /** Visible only for the specified user roles (omit for public pages). */
  role?: string[]
}[] = [
  {
    to: "/",
    label: "Home"
  },
  {
    to: "/signin",
    label: "Sign In"
  },
  {
    to: "/signup",
    label: "Sign Up"
  },
  {
    to: "/dashboard",
    label: "Dashboard",
    role: ["admin", "user"]
  },
  {
    to: "/profile",
    label: "Profile",
    role: ["admin", "user"]
  },
  {
    to: "/users",
    label: "Users",
    role: ["admin"]
  }
] as const

export function Menu({
  role
}: Readonly<{
  /** User role */
  role?: string
}>) {
  return (
    <nav className="flex items-center gap-x-4 text-sm font-semibold w-full">
      {menuItems
        .filter(item => item.role === role || (role && item.role?.includes(role)))
        .map((item, index) => (
          <MenuItem key={item.to} to={item.to} style={{ animationDelay: `${index * 90 + 80}ms` }}>
            {item.label}
          </MenuItem>
        ))}
      {role && (
        <div className="ml-auto">
          <LogoutButton />
        </div>
      )}
    </nav>
  )
}

function MenuItem({ to, style, children }: Readonly<{ to: string; style?: CSSProperties; children: React.ReactNode }>) {
  return (
    <Link to={to} className="nav-link animate-rise-in" activeProps={{ className: "nav-link is-active" }} style={style}>
      {children}
    </Link>
  )
}

function LogoutButton() {
  const navigate = useNavigate()
  const { signOut } = useAuthClient()
  const progress = useProgress()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loading) {
      progress.start()
    } else {
      progress.stop()
    }
  }, [loading])

  return (
    <ConfirmDialog
      title="Sign Out?"
      onConfirm={async () => {
        setLoading(true)

        const { error } = await signOut({
          fetchOptions: {
            onSuccess: () => {
              navigate({ to: "/signin" })
            }
          }
        })

        if (error) {
          toast.error(error.message ?? error.statusText)
        }

        setLoading(false)
      }}
    >
      Sign Out
    </ConfirmDialog>
  )
}
