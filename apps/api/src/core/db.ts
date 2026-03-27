import { Pool } from "pg"
import { logger } from "./logger"

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxLifetimeSeconds: 60,
  allowExitOnIdle: true
})

pool.on("error", error => {
  logger.error({ error }, "Database error")
})

export const db = {
  query: async (text: string, params: unknown[]) => pool.query(text, params)
}
