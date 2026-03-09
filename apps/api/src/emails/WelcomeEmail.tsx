import { Email } from "./template"

export function WelcomeEmail({ name, app }: { name: string; app: string }) {
  return (
    <Email title={`Again, welcome to ${app}!`}>
      <div>
        <h2>Hello {name} 👋</h2>
        <p>This is a test email, stay calm.</p>
        <p style={{ color: "red" }}>If you didn’t sign up, just ignore this email.</p>
      </div>
    </Email>
  )
}
