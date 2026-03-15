import nodemailer from "nodemailer"
import { logger } from "#/logger"
import settings from "../../../../settings.toml"
import { getChangeEmailHtml } from "./ChangeEmail"
import { getResetPasswordHtml } from "./ResetPassword"
import { getVerificationHtml } from "./Verification"

type EmailType = "verification" | "changeEmail" | "resetPassword"

/** Email sender */
const from = `${settings.app.name} <${settings.email.from}>`

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: !!process.env.SMTP_SECURE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

void (async () => {
  try {
    await transporter.verify()
    logger.info("SMTP server is ready to take our messages")
  } catch (error) {
    logger.warn({ error }, "SMTP verification failed")
  }
})()

export async function sendEmail(type: EmailType, to: string, payload: Record<string, string>) {
  let subject: string
  let html: string

  switch (type) {
    case "changeEmail":
      html = await getChangeEmailHtml(to, payload.url)
      subject = `Welcome to ${settings.app.name}!`
      break
    case "verification":
      html = await getVerificationHtml(payload.url)
      subject = `[${settings.app.name}] Verify your email address`
      break
    case "resetPassword":
      html = await getResetPasswordHtml(payload.url)
      subject = `[${settings.app.name}] Reset your password`
      break
  }

  try {
    await transporter.sendMail({ from, to, subject, html })
  } catch (error: any) {
    logger.error({ message: error.message }, "Email sending error")
  }
}
