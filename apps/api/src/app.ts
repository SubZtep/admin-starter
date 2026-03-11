import { Hono } from "hono"
import { cors } from "hono/cors"
import { authMiddleware } from "./middleware/auth"
import { routes } from "./routes"
import type { RouteVariables } from "./types"

export const app = new Hono<{ Variables: RouteVariables }>()

// CORS
if (process.env.NODE_ENV === "production") {
  app.use("*", cors({ origin: process.env.CORS_ORIGIN!, credentials: true }))
}

// Attach auth middleware
app.use("*", authMiddleware)

// Mount routes
app.route("/", routes)

export default {
  port: Number(process.env.PORT),
  fetch: app.fetch
}
