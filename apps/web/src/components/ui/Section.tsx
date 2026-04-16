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
      className={cn(
        "sm:border border-outline-variant/30 sm:bg-surface-container sm:shadow-md rounded-2xl sm:py-4 sm:px-5 mx-auto",
        className
      )}
      style={style}
    >
      {children}
    </section>
  )
}
