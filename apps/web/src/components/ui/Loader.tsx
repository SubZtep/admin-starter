import { cn } from "@app/shared"
import { LoaderCircle } from "lucide-react"

export function Loader({ slim = false }: Readonly<{ slim?: boolean }>) {
  return (
    <div className={cn("flex justify-center", slim || "mt-16")}>
      <LoaderCircle size={32} aria-label="Loading" className="animate-spin text-primary opacity-70" />
    </div>
  )
}
