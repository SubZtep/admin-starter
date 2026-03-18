import { useLoaderData } from "@tanstack/react-router"

/** Currently signed in user. */
export function useUser() {
  const rootData = useLoaderData({ from: "__root__" })
  return rootData?.session?.user ?? null
}
