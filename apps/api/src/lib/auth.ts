import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
  trustedOrigins: [process.env.CORS_ORIGIN!],
  database: new Pool({
    connectionString: process.env.POSTGRES_URL
  }),
  experimental: {
    joins: true
  },
  emailAndPassword: {
    enabled: true
  }
})
