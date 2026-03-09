import { useProgress } from "@bprogress/react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "react-toastify"
import { useAuthClient } from "#/hooks/auth-client"

export default function LogoutButton({ className }: { className?: string }) {
  const navigate = useNavigate()
  const { signOut } = useAuthClient()
  const progress = useProgress()

  return (
    <button
      type="button"
      onClick={async () => {
        progress.start()
        const { error, data } = await signOut()
        progress.stop()
        if (error) {
          toast.error(error.message ?? error.statusText)
        }
        if (data?.success) {
          navigate({ to: "/signin" })
        }
      }}
      className={className}
    >
      Sign Out
    </button>
  )
}
