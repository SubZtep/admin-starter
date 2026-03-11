import nodemailer from "nodemailer"
import { getChangeEmailHtml } from "#/emails/ChangeEmail"
import { getVerificationHtml } from "#/emails/Verification"
import settings from "../../../../settings.toml"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: !!process.env.SMTP_SECURE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const from = `${settings.app.name} <${settings.email.from}>`

export async function sendVerificationEmail(to: string, url: string) {
  const html = await getVerificationHtml(url)
  const subject = `Welcome to ${settings.app.name}!`
  await transporter.sendMail({ from, to, subject, html })
}

export async function sendChangeEmailEmail(to: string, url: string) {
  const html = await getChangeEmailHtml(to, url)
  const subject = `Welcome to ${settings.app.name}!`
  await transporter.sendMail({ from, to, subject, html })
}
