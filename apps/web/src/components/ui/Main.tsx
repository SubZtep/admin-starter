import { cn } from "@kaja/shared"

export function Main({
  full = false,
  className,
  children,
  ...props
}: Readonly<{ full?: boolean } & React.ComponentProps<"main">>) {
  return (
    <main className={cn("px-4 py-12 text-fg", full || "container", className)} {...props}>
      {children}
    </main>
  )
}
