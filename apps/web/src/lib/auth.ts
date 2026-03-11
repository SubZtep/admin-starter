import { adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export function createAuthClientWithUrl(apiUrl: string) {
  return createAuthClient({
    baseURL: apiUrl,
    basePath: "/auth",
    plugins: [adminClient()],
    fetchOptions: {
      credentials: "include"
    }
  })
}
