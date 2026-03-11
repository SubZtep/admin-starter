import { render } from "@react-email/render"
import { Email } from "./template"

export function Verification({ url }: { url: string }) {
  return (
    <Email title="Verify your email address">
      <div>
        <h2>Hey-ho 👋</h2>
        <p>Almost there.</p>
        <p>Click the link to verify your email:</p>
        <pre>{url}</pre>
      </div>
    </Email>
  )
}

export async function getVerificationHtml(url: string) {
  return await render(<Verification url={url} />)
}
