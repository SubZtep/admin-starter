import { Email } from "./template"

export function VerificationEmail({ url }: { url: string }) {
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
