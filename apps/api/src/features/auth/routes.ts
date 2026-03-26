import { auth } from "#/features/auth/auth"
import type { RouteRegProps } from "#/types"

export function registerAuthRoutes(app: RouteRegProps) {
  app.on(["POST", "GET"], "/*", c => auth.handler(c.req.raw))
}
