import { Link, Text } from "@react-email/components"
import { render } from "@react-email/render"
import { Email } from "./template"

export function Verification({ url }: { url: string }) {
  return (
    <Email>
      <Text style={{ fontSize: "21px", marginBottom: "15px" }}>Hey-ho 👋</Text>
      <Text>
        Click the link to verify your email:
        <br />
        <Link href={url}>{url}</Link>
      </Text>
    </Email>
  )
}

export async function getVerificationHtml(url: string) {
  return await render(<Verification url={url} />)
}
