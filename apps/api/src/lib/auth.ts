import { betterAuth, type User } from "better-auth"
import { admin, jwt, openAPI } from "better-auth/plugins"
import { Pool } from "pg"
import { sendChangeEmailEmail, sendVerificationEmail } from "./email"

export const auth = betterAuth({
  trustedOrigins: [process.env.CORS_ORIGIN!],
  database: new Pool({
    connectionString: process.env.DATABASE_URL
  }),
  plugins: [
    jwt({
      jwt: {
        definePayload: async ({ user }) => ({
          sub: user.id,
          email: user.email
        }),
        expirationTime: "15min"
      }
    }),
    admin(),
    openAPI()
  ],
  experimental: {
    joins: true
  },
  emailAndPassword: {
    enabled: true
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }: { user: User; url: string }) => {
      const urlObj = new URL(url)
      urlObj.searchParams.set("callbackURL", new URL("/dashboard", process.env.CORS_ORIGIN!).toString())
      sendVerificationEmail(user.email, urlObj.toString())
    },
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600 * 24 // 1 day
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ newEmail, url }) => {
        void sendChangeEmailEmail(newEmail, url)
      }
    }
  }
})
