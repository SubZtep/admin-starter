import { cn } from "@app/shared"
import { PawPrint } from "lucide-react"

export function Logo({ className }: Readonly<{ className?: string }>) {
  return <PawPrint size={28} className={cn("hover:cursor-none text-pink-800", className)} />
}
