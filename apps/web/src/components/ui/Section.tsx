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
      className={cn("sm:border border-gray-900 sm:bg-gray-800/90 sm:shadow-md rounded-2xl sm:p-4 mx-auto", className)}
      style={style}
    >
      {children}
    </section>
  )
}
