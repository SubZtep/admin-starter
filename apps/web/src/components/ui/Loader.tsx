import { cn } from "@app/shared"
import { BrainCog } from "lucide-react"

export function Loader({ slim = false }: Readonly<{ slim?: boolean }>) {
  return (
    <div className={cn("flex justify-center", slim || "mt-16")}>
      <BrainCog size={32} aria-label="Loading" className="animate-spin opacity-70" />
    </div>
  )
}
