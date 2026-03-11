import { Link } from "@tanstack/react-router"

export function Chip({ to, children }: Readonly<{ to: string; children: React.ReactNode }>) {
  return (
    <div className="m-0 shrink-0 text-base font-semibold tracking-tight">
      <Link
        to={to}
        className="inline-flex items-center gap-2 rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm text-(--sea-ink) no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
      >
        <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
        {children}
      </Link>
    </div>
  )
}
