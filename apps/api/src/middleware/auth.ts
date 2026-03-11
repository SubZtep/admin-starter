import { createMiddleware } from "hono/factory"
import { auth } from "../auth"
import type { RouteVariables } from "../types"

export const authMiddleware = createMiddleware<{ Variables: RouteVariables }>(async (c, next) => {
  let user = null

  // 1️⃣ JWT token from Authorization header
  const authHeader = c.req.header("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    const session = await auth.api.getSession({ headers: new Headers({ authorization: `Bearer ${token}` }) })
    user = session?.user ?? null
  }

  // 2️⃣ Cookie session fallback
  if (!user) {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    user = session?.user ?? null
  }

  c.set("user", user)

  await next()
})
