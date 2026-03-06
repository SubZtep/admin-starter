import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { auth } from "./lib/auth"
import usersRoutes from "./routes/users"

const app = new Hono()

app.use("*", logger())
app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN!,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
)

app.on(["POST", "GET"], "/api/auth/*", c => auth.handler(c.req.raw))
app.get("/health", c => c.json({ status: "ok" }))
app.get("/api/hello", c => c.json({ message: "Hello from Hono!" }))
app.route("/users", usersRoutes)

export default {
  port: process.env.PORT ?? 3001,
  fetch: app.fetch
}
