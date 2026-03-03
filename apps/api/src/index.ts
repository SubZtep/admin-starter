import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

const app = new Hono()

app.use("*", logger())
app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000"
  })
)

app.get("/health", c => c.json({ status: "ok" }))

app.get("/api/hello", c => c.json({ message: "Hello from Hono!" }))

export default {
  port: process.env.PORT ?? 3001,
  fetch: app.fetch
}
