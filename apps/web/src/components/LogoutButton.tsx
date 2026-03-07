import { useNavigate } from "@tanstack/react-router"
import { toast } from "react-toastify"
import { authClient } from "#/lib/auth"

export default function LogoutButton() {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={async () => {
        const { error, data } = await authClient.signOut()
        if (error) {
          toast.error(error.message ?? error.statusText)
        }
        if (data?.success) {
          navigate({ to: "/signin" })
        }
      }}
    >
      Sign Out
    </button>
  )
}
