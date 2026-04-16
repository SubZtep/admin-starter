import { cn } from "@app/shared"
import { Puzzle } from "lucide-react"

export function Logo({ className }: Readonly<{ className?: string }>) {
  return (
    <Puzzle
      size={28}
      strokeWidth={2}
      aria-label="Puzzle Logo"
      className={cn("text-teal-400 hover:cursor-none", className)}
    />
  )
}
