import { Link } from "@tanstack/react-router"
import { useUser } from "#/hooks/use-user"
import Loader from "./Loader"
import LogoutButton from "./LogoutButton"

export default function Header() {
  const { user, isAdmin, isLoading } = useUser()

  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-(--header-bg) px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap-reverse items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        {isLoading ? (
          <Loader slim />
        ) : (
          <>
            <div className="m-0 shrink-0 text-base font-semibold tracking-tight">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm text-(--sea-ink) no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
              >
                <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
                Dashboard
              </Link>
            </div>

            <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0">
              {isAdmin && (
                <Link to="/users" className="nav-link" activeProps={{ className: "nav-link is-active" }}>
                  Users
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/profile" className="nav-link" activeProps={{ className: "nav-link is-active" }}>
                    Profile
                  </Link>
                  <LogoutButton />
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
          </>
        )}
      </nav>
    </header>
  )
}
