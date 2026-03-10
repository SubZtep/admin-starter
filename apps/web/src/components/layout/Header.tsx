import { cn } from "@app/shared"
import { Link } from "@tanstack/react-router"
import { PawPrint } from "lucide-react"
import { LogoutButton } from "#/components/layout/LogoutButton"
import { Chip } from "#/components/ui/Chip"
import { Loader } from "#/components/ui/Loader"
import { NavLink } from "#/components/ui/NavLink"
import { useUser } from "#/hooks/user"

export function Header() {
  const { user, isAdmin, isLoading } = useUser()

  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-(--header-bg) px-4 backdrop-blur-lg">
      <nav className="min-h-[50px] w-full justify-between page-wrap flex flex-wrap-reverse items-center gap-x-4 hover:[&_.lucide-paw-print]:animate-pulse">
        {isLoading ? (
          <Loader slim />
        ) : (
          <>
            {user ? <Chip>Dashboard</Chip> : <PawPrint size={28} className="hover:cursor-none text-pink-800" />}

            <div className="flex items-center gap-x-4 text-sm font-semibold">
              {user ? (
                <>
                  {isAdmin && <NavLink to="/users">Users</NavLink>}
                  <NavLink to="/profile">Profile</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/signin">Sign In</NavLink>
                  <NavLink to="/signup">Sign Up</NavLink>
                  <NavLink to="/about">About</NavLink>
                </>
              )}
            </div>
            <LogoutButton className={cn(user || "invisible")} />
          </>
        )}
      </nav>
    </header>
  )
}
