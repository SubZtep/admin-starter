import { cn } from "@app/shared"
import type { CSSProperties } from "react"

export function Main({
  full = false,
  className,
  style,
  children
}: Readonly<{
  full?: boolean
  className?: string
  style?: CSSProperties
  children: React.ReactNode
}>) {
  return (
    <main className={cn("px-4 py-12 text-fg", full || "container", className)} style={style}>
      {children}
    </main>
  )
}
