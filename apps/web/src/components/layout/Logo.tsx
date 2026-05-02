import { cn } from "@kaja/shared"
import { Puzzle } from "lucide-react"

export function Logo({ className }: Readonly<{ className?: string }>) {
  return (
    <Puzzle
      size={28}
      strokeWidth={2}
      aria-label="Puzzle piece"
      className={cn("text-purple-500 neon-glow hover:cursor-none", className)}
    />
  )
}
