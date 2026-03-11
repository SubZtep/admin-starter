import { render } from "@react-email/render"
import nodemailer from "nodemailer"
import { ChangeEmail } from "#/emails/ChangeEmail"
import { Verification } from "#/emails/Verification"
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
  const html = await render(<Verification url={url} />)
  const subject = `Welcome to ${settings.app.name}!`
  await transporter.sendMail({ from, to, subject, html })
}

export async function sendChangeEmailEmail(to: string, url: string) {
  const html = await render(<ChangeEmail newEmail={to} url={url} />)
  const subject = `Welcome to ${settings.app.name}!`
  await transporter.sendMail({ from, to, subject, html })
}
