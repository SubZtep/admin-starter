import { useUser } from "#/hooks/user"
import { Logo } from "./Logo"
import { Menu } from "./Menu"

export function Header() {
  const user = useUser()

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/30 bg-surface/80 backdrop-blur-lg">
      <div className="container min-h-[50px] flex items-center gap-4">
        <Logo />
        <Menu role={user?.role ?? undefined} />
      </div>
    </header>
  )
}
