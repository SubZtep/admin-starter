import { cn } from "@kaja/shared"
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
        "cursor-default mx-auto rounded-2xl sm:border sm:border-border/40 sm:bg-surface sm:px-5 sm:py-4 sm:shadow-md",
        className
      )}
      style={style}
    >
      {children}
    </section>
  )
}
