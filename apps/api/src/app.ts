import { Hono } from "hono"
import { cors } from "hono/cors"
import { healthRoutes } from "#/core/routes/health"
import { userRoutes } from "#/core/routes/user"
import { authMiddleware, authRoutes } from "#/features/auth"
import { kajaRoutes } from "#/features/kaja"
import type { RouteProps } from "#/types"

export const app = new Hono<RouteProps>()

// CORS
app.use("*", cors({ origin: process.env.CORS_ORIGIN, credentials: true }))

// Attach auth middleware
app.use("*", authMiddleware)

// Mount routes
app.route("/health", healthRoutes)
app.route("/auth", authRoutes)
app.route("/kaja", kajaRoutes)
app.route("/users", userRoutes)

// Run server
export default {
  port: Number(process.env.PORT),
  fetch: app.fetch
}
