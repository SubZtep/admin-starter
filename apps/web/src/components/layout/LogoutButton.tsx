import { useProgress } from "@bprogress/react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "react-toastify"
import { useAuthClient } from "#/hooks/auth-client"
import { Button } from "../form/primitives/Button"

export function LogoutButton({ className }: { className?: string }) {
  const navigate = useNavigate()
  const { signOut } = useAuthClient()
  const progress = useProgress()

  return (
    <Button
      size="sm"
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
    </Button>
  )
}
