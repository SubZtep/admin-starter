import { Body, Head, Html } from "@react-email/components"

export const WelcomeEmail = ({ name, app }: { name: string; app: string }) => (
  <Email title={`Again, welcome to ${app}!`}>
    <div>
      <h2>Hello {name} 👋</h2>
      <p>This is a test email, stay calm.</p>
      <p style={{ color: "red" }}>If you didn’t sign up, just ignore this email.</p>
    </div>
  </Email>
)

export function Email({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Html lang="en">
      <Head />
      <Body>
        <h1>{title}</h1>
        {children}
      </Body>
    </Html>
  )
}
