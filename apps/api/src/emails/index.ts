import nodemailer from "nodemailer"
import { logger } from "#/core/logger"
import { getChangeEmailHtml } from "./ChangeEmail"
import { getResetPasswordHtml } from "./ResetPassword"
import { getVerificationHtml } from "./Verification"

type EmailType = "verification" | "changeEmail" | "resetPassword"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: isItTrue(process.env.SMTP_SECURE),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

if (!process.env.CI) {
  void (async () => {
    try {
      const verified = await transporter.verify()
      logger.info({ verified }, "SMTP server is ready to take our messages")
    } catch (error) {
      logger.warn({ error }, "SMTP verification failed")
    }
  })()
}

export async function sendEmail(type: EmailType, to: string, payload: Record<string, string>) {
  let subject: string
  let html: string

  switch (type) {
    case "changeEmail":
      html = await getChangeEmailHtml(to, payload.url)
      subject = `Welcome to Admin Starter!`
      break
    case "verification":
      html = await getVerificationHtml(payload.url)
      subject = `[Admin Starter] Verify your email address`
      break
    case "resetPassword":
      html = await getResetPasswordHtml(payload.url)
      subject = `[Admin Starter] Reset your password`
      break
  }

  try {
    await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html })
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error({ error: error.message }, "Email sending error")
      throw error
    }
    logger.error({ error: "Unknown error" }, "Email sending error")
    throw new Error("Unknown error")
  }
  // TODO: let user know about email sending errors.
}

/** Determines the boolean value represented by a string. */
function isItTrue(value: string) {
  const normalized = value.trim().toLowerCase()
  return normalized === "true" || normalized === "1" || normalized === "on" || normalized.startsWith("y")
}
