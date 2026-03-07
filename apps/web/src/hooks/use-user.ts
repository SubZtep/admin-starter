import { authClient } from "#/lib/auth"

/** Currently signed in user. */
export function useUser() {
  const { data, isPending } = authClient.useSession()

  return {
    user: data?.user ?? null,
    isLoading: isPending,
    isAdmin: data?.user?.role === "admin"
  }
}
