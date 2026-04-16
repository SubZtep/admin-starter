import { NOTIFICATION_CORRELATION_ID_HEADER } from "@app/shared"
import { type BetterAuthPlugin, betterAuth } from "better-auth"
import { admin, bearer, jwt, openAPI } from "better-auth/plugins"
import { pool } from "#/core/db"
import { logger } from "#/core/logger"
import { sendEmail } from "#/emails"
import type { EmailPayload } from "#/emails/template"

const isDevMode = process.env.NODE_ENV === "development"
type AuthLoggerLevel = "debug" | "trace" | "fatal" | "error" | "warn" | "info"
type AuthUser = EmailPayload["user"]

function sendAuthEmail(args: Parameters<typeof sendEmail>[0]) {
  // FIXME: Avoid awaiting the email sending to prevent timing attacks. (from Better-Auth doc)
  void sendEmail(args).catch(error => {
    // TODO: notify user somehow
    logger.error(
      {
        error,
        type: args.type,
        userId: args.payload.user.id,
        email: args.payload.user.email
      },
      "Failed to send auth email"
    )
  })
}

const plugins: BetterAuthPlugin[] = [
  bearer(),
  jwt({
    jwks: {
      disablePrivateKeyEncryption: isDevMode
    },
    jwt: {
      definePayload: async ({ user }: Readonly<{ user: AuthUser }>) => ({
        sub: user.id,
        email: user.email
      }),
      expirationTime: "15min"
    }
  }),
  admin()
]

if (isDevMode) {
  plugins.push(openAPI())
}

export const auth = betterAuth({
  trustedOrigins: [process.env.CORS_ORIGIN],
  advanced: {
    database: {
      generateId: false,
      defaultFindManyLimit: 1000
    },
    ...(process.env.CROSS_PARENT_DOMAIN
      ? {
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
      : {})
  },
  database: pool,
  basePath: "/auth",
  plugins,
  logger: {
    log: (level: AuthLoggerLevel, message: string, args: unknown) => {
      logger[level](args, message)
    }
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }: Readonly<EmailPayload>, request: Request) => {
      const correlationId = request.headers.get(NOTIFICATION_CORRELATION_ID_HEADER) ?? undefined

      sendAuthEmail({
        type: "resetPassword",
        payload: { user, url },
        notification: correlationId
          ? {
              correlationId,
              flow: "reset-password"
            }
          : undefined
      })
    }
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }: Readonly<EmailPayload>) => {
      const urlObj = new URL(url)
      urlObj.searchParams.set("callbackURL", new URL("/dashboard", process.env.CORS_ORIGIN).toString())
      sendAuthEmail({ type: "verification", payload: { user, url: urlObj.toString() } })
    },
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600 * 24 // 1 day
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, url, newEmail }: Readonly<EmailPayload & { newEmail: string }>) => {
        sendAuthEmail({ type: "changeEmail", payload: { user, url, newEmail } })
      }
    }
  }
})
