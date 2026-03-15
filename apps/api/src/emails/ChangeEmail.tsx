import { Link, Section, Text } from "@react-email/components"
import { render } from "@react-email/render"
import { Email } from "./template"

export function ChangeEmail({ newEmail, url }: { newEmail: string; url: string }) {
  return (
    <Email>
      <Section>
        <big>Hey-ho 👋</big>
      </Section>
      <Section>
        <Text>
          Click the link to approve the change to {newEmail}: <Link href={url}>{url}</Link>
        </Text>
      </Section>
    </Email>
  )
}

export async function getChangeEmailHtml(to: string, url: string) {
  return await render(<ChangeEmail newEmail={to} url={url} />)
}
