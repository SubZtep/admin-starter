import { render } from "@react-email/render"
import nodemailer from "nodemailer"
import settings from "../../../../settings.toml"
import { WelcomeEmail } from "../emails/WelcomeEmail"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: !!process.env.SMTP_SECURE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendWelcomeEmail(to: string, name: string) {
  const html = await render(<WelcomeEmail name={name} app={settings.app.name} />)

  await transporter.sendMail({
    from: `${settings.app.name} <${settings.email.from}>`,
    to,
    subject: `Welcome to ${settings.app.name}!`,
    html
  })
}
