import { Link, Text } from "@react-email/components"
import { render } from "@react-email/render"
import { Email } from "./template"

export function ResetPassword({ url }: Readonly<{ url: string }>) {
  return (
    <Email>
      <Text style={{ fontSize: "21px", marginBottom: "15px" }}>Hey-ho 👋</Text>
      <Text>
        Click the link to reset your password:
        <br />
        <Link href={url}>{url}</Link>
      </Text>
    </Email>
  )
}

export async function getResetPasswordHtml(url: string) {
  return await render(<ResetPassword url={url} />)
}
