import { Link, Section } from "@react-email/components"
import { render } from "@react-email/render"
import { Email } from "./template"

export function ResetPassword({ url }: Readonly<{ url: string }>) {
  return (
    <Email>
      <Section>
        <big>Hey-ho 👋</big>
      </Section>
      <Section>
        <p>
          Click the link to reset your password: <Link href={url}>{url}</Link>
        </p>
      </Section>
    </Email>
  )
}

export async function getResetPasswordHtml(url: string) {
  return await render(<ResetPassword url={url} />)
}
