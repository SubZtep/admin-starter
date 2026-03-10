import { cn } from "@app/shared"
import { PawPrint } from "lucide-react"
import { LogoutButton } from "#/components/layout/LogoutButton"
import { Chip } from "#/components/ui/Chip"
import { NavLink } from "#/components/ui/NavLink"
import { useUser } from "#/hooks/user"

export function Header() {
  const { user, isAdmin } = useUser()

  return (
    <header className="sticky top-0 z-50 border-b border-(--line) bg-(--header-bg) px-4 backdrop-blur-lg">
      {user ? <MenuLoggedIn isAdmin={isAdmin} /> : <Menu />}
    </header>
  )
}

const MENU_CLASSES = "min-h-[50px] w-full justify-between page-wrap flex flex-wrap-reverse items-center gap-x-4"

function Menu() {
  return (
    <nav className={cn(MENU_CLASSES, "hover:[&_.lucide-paw-print]:animate-pulse")}>
      <PawPrint size={28} className="hover:cursor-none text-pink-800" />
      <div className="flex items-center gap-x-4 text-sm font-semibold">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/signin">Sign In</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>
      <div></div>
    </nav>
  )
}

function MenuLoggedIn({ isAdmin }: { isAdmin: boolean }) {
  return (
    <nav className={MENU_CLASSES}>
      <Chip to="/dashboard">Dashboard</Chip>
      <div className="flex items-center gap-x-4 text-sm font-semibold">
        {isAdmin && <NavLink to="/users">Users</NavLink>}
        <NavLink to="/profile">Profile</NavLink>
      </div>
      <LogoutButton />
    </nav>
  )
}
