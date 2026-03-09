import { cn } from "@app/shared"
import { BrainCog } from "lucide-react"

export default function Loader({ slim = false }: { slim?: boolean }) {
  return (
    <div className={cn("flex justify-center", slim || "mt-16")}>
      <BrainCog size={32} aria-label="Loading" className="animate-spin opacity-70" />
    </div>
  )
}
