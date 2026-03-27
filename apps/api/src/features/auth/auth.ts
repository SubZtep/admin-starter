import { type BetterAuthPlugin, betterAuth, type User } from "better-auth"
import { admin, bearer, jwt, openAPI } from "better-auth/plugins"
import { pool } from "#/core/db"
import { logger } from "#/core/logger"
import { sendEmail } from "#/emails"

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
  ...(process.env.CROSS_PARENT_DOMAIN
    ? {
        advanced: {
          crossSubDomainCookies: {
            enabled: true,
            domain: process.env.CROSS_PARENT_DOMAIN
          },
          cookies: {
            session_token: {
              attributes: {
                sameSite: "none",
                secure: true,
                httpOnly: true,
                path: "/"
              }
            }
          }
        }
      }
    : {}),
  database: pool,
  basePath: "/auth",
  plugins,
  logger: {
    log: (level, message, args) => {
      logger[level](args, message)
    }
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      sendEmail("resetPassword", user.email, { url })
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
