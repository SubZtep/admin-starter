import { cn } from "@app/shared"
import { Puzzle } from "lucide-react"

export function Logo({ className }: Readonly<{ className?: string }>) {
  return (
    <Puzzle
      size={26}
      strokeWidth={2}
      aria-label="Puzzle Logo"
      className={cn("hover:cursor-none text-pink-800", className)}
    />
  )
}
