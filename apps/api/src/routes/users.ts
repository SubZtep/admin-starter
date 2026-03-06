import { Hono } from "hono"
import { auth } from "../lib/auth"

const app = new Hono()

app.get("/list", async c => {
  try {
    const result = await auth.api.listUsers({
      query: {
        limit: 1000
      }
    })

    const users = result.users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name
    }))

    return c.json({ users })
  } catch (error) {
    console.error("Error listing users", error)
    return c.json({ error: "Unable to fetch users" }, 500)
  }
})

export default app
