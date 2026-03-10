import { Email } from "./template"

export function ChangeEmail({ newEmail, url }: { newEmail: string; url: string }) {
  return (
    <Email title="Approve email change">
      <div>
        <h2>Hey-ho 👋</h2>
        <p>Almost there.</p>
        <p>Click the link to verify your email:</p>
        <p>
          Click the link to approve the change to {newEmail}: <a href="{url}">{url}</a>
        </p>
      </div>
    </Email>
  )
}
