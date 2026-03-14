import { cn } from "@app/shared"
import { useUser } from "#/hooks/user"
import { Logo } from "./Logo"
import { Menu } from "./Menu"

export function Header() {
  const { user, isLoading } = useUser()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-400/20 bg-gray-800/80 backdrop-blur-lg hover:[&_.lucide]:animate-pulse ">
      <div className="container min-h-[50px] flex items-center gap-4">
        <Logo className={cn(isLoading && "animate-spin")} />
        <Menu role={user?.role ?? undefined} />
      </div>
    </header>
  )
}
