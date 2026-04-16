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
        "mx-auto rounded-2xl sm:border sm:border-slate-700/30 sm:bg-slate-900 sm:px-5 sm:py-4 sm:shadow-md",
        className
      )}
      style={style}
    >
      {children}
    </section>
  )
}
