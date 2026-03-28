import { Pool } from "pg"
import { logger } from "./logger"

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
  maxLifetimeSeconds: 60,
  allowExitOnIdle: true,
  onConnect: async client => {
    await client.query("SET TIME ZONE 'UTC'")
  }
})

pool.on("error", error => {
  logger.error({ error }, "Database error")
})

export const db = {
  query: async (text: string, params: unknown[]) => pool.query(text, params)
}
