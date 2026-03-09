import { app } from "./lib/app"
import { auth } from "./lib/auth"
import { sendWelcomeEmail } from "./lib/email"
import usersRoutes from "./routes/users"

app.on(["POST", "GET"], "/api/auth/*", c => auth.handler(c.req.raw))
app.get("/health", c => c.json({ status: "ok" }))
app.get("/api/hello", async c => {
  const user = c.get("user")
  if (user) {
    await sendWelcomeEmail(`${user.name} <${user.email}>`, user.name)
  }
  return c.json({ message: "Hello from Hono!" })
})

app.route("/users", usersRoutes)

export default {
  port: Number(process.env.PORT),
  fetch: app.fetch
}
