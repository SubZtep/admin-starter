import { authClient } from "#/lib/auth"

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut()
      }}
    >
      Sign Out
    </button>
  )
}
