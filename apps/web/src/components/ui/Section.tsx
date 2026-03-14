import { cn } from "@app/shared"
import type { CSSProperties } from "react"

export function Section({
  className,
  style,
  children
}: Readonly<{
  className?: string
  style?: CSSProperties
  children: React.ReactNode
}>) {
  return (
    <section
      className={cn("border border-gray-900 bg-gray-800/90 shadow-md rounded-2xl p-4 mx-auto", className)}
      style={style}
    >
      {children}
    </section>
  )
}
