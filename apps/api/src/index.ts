import { app } from "./lib/app"
import { auth } from "./lib/auth"
import usersRoutes from "./routes/users"

app.on(["POST", "GET"], "/api/auth/*", c => auth.handler(c.req.raw))
app.get("/health", c => c.json({ status: "ok" }))

app.route("/users", usersRoutes)

export default {
  port: Number(process.env.PORT),
  fetch: app.fetch
}
