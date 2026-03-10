import { cn } from "@app/shared"
import type { CSSProperties } from "react"

export function Main({
  className,
  style,
  children
}: {
  className?: string
  style?: CSSProperties
  children: React.ReactNode
}) {
  return (
    <main className={cn("page-wrap px-4 py-12", className)} style={style}>
      {children}
    </main>
  )
}
