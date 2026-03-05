import { betterAuth } from "better-auth"
import { openAPI } from "better-auth/plugins"
import { Pool } from "pg"

export const auth = betterAuth({
  trustedOrigins: [process.env.CORS_ORIGIN!],
  database: new Pool({
    connectionString: process.env.POSTGRES_URL
  }),
  plugins: [openAPI()],
  experimental: {
    joins: true
  },
  emailAndPassword: {
    enabled: true
  }
})
