import { Link, Text } from "@react-email/components"
import { render } from "@react-email/render"
import { Email } from "./template"

export function ChangeEmail({ newEmail, url }: Readonly<{ newEmail: string; url: string }>) {
  return (
    <Email>
      <Text style={{ fontSize: "21px", marginBottom: "15px" }}>Hey-ho 👋</Text>
      <Text>
        Click the link to approve the change to {newEmail}:
        <br />
        <Link href={url}>{url}</Link>
      </Text>
    </Email>
  )
}

export async function getChangeEmailHtml(to: string, url: string) {
  return await render(<ChangeEmail newEmail={to} url={url} />)
}
