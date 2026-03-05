import { loginSchema } from "@app/schemas"
import { Hono } from "hono"
import { z } from "zod"
import { auth } from "../lib/auth"
import { createAccessToken } from "../lib/jwt"

const app = new Hono()

app.post("/login", async c => {
  // return { hello: "world" }
  const body = await c.req.json()
  await Bun.sleep(666)
  // console.log("XXX", await c.req.json())
  // return c.json({ hey: "ho", body })

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ errors: z.treeifyError(parsed.error) }, 400)
  }

  const clientType = c.req.header("X-Client-Type") ?? "mobile"

  // Sign in with better-auth
  const result = await auth.api.signInEmail({
    body: {
      email: parsed.data.email,
      password: parsed.data.password
    }
  })

  if (!result) {
    return c.json({ error: "Invalid credentials" }, 401)
  }

  // WEB FLOW (cookie session)
  if (clientType === "web") {
    // better-auth already sets HttpOnly cookie
    return c.json({ success: true })
  }

  // MOBILE FLOW (JWT)
  if (clientType === "mobile") {
    const userId = result.user.id

    const accessToken = createAccessToken(userId)

    // Use better-auth session as refresh token
    // const refreshToken = result.session.id
    const refreshToken = result.token

    return c.json({
      accessToken,
      refreshToken,
      expiresIn: 900 // 15 minutes
    })
  }

  return c.json({ error: "Invalid client type" }, 400)
})

export default app
