import { BrainCog } from "lucide-react"

export default function Loader({ slim = false }: { slim?: boolean }) {
  return (
    <div className={`my-${slim ? 0 : 32} flex justify-center`}>
      <BrainCog size={32} aria-label="Loading" className="animate-spin opacity-80" />
    </div>
  )
}
