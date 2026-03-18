import { useLoaderData } from "@tanstack/react-router"
// import { useAuthClient } from "./auth-client"

/** Currently signed in user. */
export function useUser() {
  // const { session } = useLoaderData({ from: "__root__" })
  const rootData = useLoaderData({ from: "__root__" })

  const session = rootData?.session
  // const { useSession } = useAuthClient()
  // const { data, isPending } = useSession()

  const effective = session ?? null
  // const effective = data ?? session ?? null

  return {
    user: effective?.user ?? null
    // isLoading: isPending && !session,
    // isLoading: !session,
    // isAdmin: effective?.user?.role === "admin"
  }
}
