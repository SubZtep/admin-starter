import { useAuthClient } from "./auth-client"

/** Currently signed in user. */
export function useUser() {
  const { useSession } = useAuthClient({})
  const { data, isPending } = useSession()

  return {
    user: data?.user ?? null,
    isLoading: isPending,
    isAdmin: data?.user?.role === "admin"
  }
}
