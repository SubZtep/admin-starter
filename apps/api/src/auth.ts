import { type BetterAuthPlugin, betterAuth, type User } from "better-auth"
import { admin, bearer, jwt, openAPI } from "better-auth/plugins"
import { Pool } from "pg"
import { sendEmail } from "./emails"
import { logger } from "./logger"

const plugins: BetterAuthPlugin[] = [
  bearer(),
  jwt({
    jwt: {
      definePayload: async ({ user }) => ({
        sub: user.id,
        email: user.email
      }),
      expirationTime: "15min"
    }
  }),
  admin()
]

if (process.env.NODE_ENV === "development") {
  plugins.push(openAPI())
}

export const auth = betterAuth({
  trustedOrigins: [process.env.CORS_ORIGIN],
  database: new Pool({
    connectionString: process.env.DATABASE_URL
  }),
  basePath: "/auth",
  plugins,
  logger: {
    log: (level, message, args) => {
      logger[level](args, message)
    }
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token: _token }, _request) => {
      sendEmail("resetPassword", user.email, { url })
    },
    onPasswordReset: async ({ user }, _request) => {
      logger.info(`Password for user ${user.email} has been reset.`)
    }
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }: { user: User; url: string }) => {
      const urlObj = new URL(url)
      urlObj.searchParams.set("callbackURL", new URL("/dashboard", process.env.CORS_ORIGIN).toString())
      sendEmail("verification", user.email, { url: urlObj.toString() })
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
        sendEmail("changeEmail", newEmail, { url })
      }
    }
  }
})
