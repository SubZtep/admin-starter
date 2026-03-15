import nodemailer from "nodemailer"
import { logger } from "#/logger"
import settings from "../../../../settings.toml"
import { getChangeEmailHtml } from "./ChangeEmail"
import { getVerificationHtml } from "./Verification"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: !!process.env.SMTP_SECURE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

try {
  await transporter.verify()
  console.log("Server is ready to take our messages")
} catch (error: any) {
  console.error("Verification failed", error.message)
}

const from = `${settings.app.name} <${settings.email.from}>`

export async function sendEmail(type: "verification" | "changeEmail", to: string, payload: Record<string, string>) {
  let subject: string
  let html: string

  switch (type) {
    case "changeEmail": {
      html = await getChangeEmailHtml(to, payload.url)
      subject = `Welcome to ${settings.app.name}!`
      break
    }
    case "verification":
      html = await getVerificationHtml(payload.url)
      subject = `Welcome to ${settings.app.name}!`
      break
  }

  try {
    await transporter.sendMail({ from, to, subject, html })
  } catch (error: any) {
    logger.error({ message: error.message }, "Email sending error")
  }
}
