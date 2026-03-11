import { Hono } from "hono"
import type { RouteVariables } from "../types"
import { authRoutes } from "./auth"
import { healthRoutes } from "./health"
import { userRoutes } from "./user"

export const routes = new Hono<{ Variables: RouteVariables }>()

routes.route("/users", userRoutes)
routes.route("/health", healthRoutes)
routes.route("/auth", authRoutes)
