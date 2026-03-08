import { adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export function createAuthClientWithUrl(apiUrl: string) {
  return createAuthClient({
    baseURL: apiUrl,
    plugins: [adminClient()],
    fetchOptions: {
      credentials: "include"
    }
  })
}
