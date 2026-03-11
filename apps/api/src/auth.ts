import { betterAuth } from "better-auth"
import { admin, jwt, openAPI } from "better-auth/plugins"
import { Pool } from "pg"

export const auth = betterAuth({
  advanced:
    process.env.NODE_ENV !== "production"
      ? {
          disableOriginCheck: true,
          disableCSRFCheck: true
        }
      : undefined,
  trustedOrigins: [process.env.CORS_ORIGIN!],
  database: new Pool({
    connectionString: process.env.DATABASE_URL
  }),
  basePath: "/auth",
  plugins: [
    jwt({
      jwt: {
        definePayload: async ({ user }) => ({ sub: user.id, email: user.email }),
        expirationTime: "15m" // short-lived access token
      }
    }),
    admin(),
    openAPI()
  ],
  emailAndPassword: { enabled: true }
})
