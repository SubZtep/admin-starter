import { cn } from "@app/shared"

export function Main({ className, children }: { className?: string; children: React.ReactNode }) {
  return <main className={cn("page-wrap px-4 py-12", className)}>{children}</main>
}
