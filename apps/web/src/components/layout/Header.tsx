import { cn } from "@app/shared"
import { Link } from "@tanstack/react-router"
import { PawPrint } from "lucide-react"
import { useUser } from "#/hooks/user"
import { Chip } from "../ui/Chip"
import Loader from "../ui/Loader"
import LogoutButton from "../ui/LogoutButton"
import { NavLink } from "../ui/NavLink"

export default function Header() {
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
                  <Link to="/" className="nav-link" activeProps={{ className: "nav-link is-active" }}>
                    Home
                  </Link>
                  <Link to="/signin" className="nav-link" activeProps={{ className: "nav-link is-active" }}>
                    Sign In
                  </Link>
                  <Link to="/signup" className="nav-link" activeProps={{ className: "nav-link is-active" }}>
                    Sign Up
                  </Link>
                  <Link to="/about" className="nav-link" activeProps={{ className: "nav-link is-active" }}>
                    About
                  </Link>
                </>
              )}
            </div>
            <LogoutButton className={cn("text-sm", user || "invisible")} />
          </>
        )}
      </nav>
    </header>
  )
}
