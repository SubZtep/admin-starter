import { useState } from "react"
import { authClient } from "#/lib/auth"

export function Profile() {
  const { data: session, isPending } = authClient.useSession()
  const [showSession, setShowSession] = useState(false)

  if (isPending) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Not logged in</div>
  }

  return (
    <div>
      {showSession ? (
        <>
          Logged in as:
          <pre className="my-3">{JSON.stringify(session, null, 2)}</pre>
        </>
      ) : (
        <button type="button" onClick={() => setShowSession(true)}>
          Show Session
        </button>
      )}
      <button
        type="button"
        onClick={async () => {
          await authClient.signOut()
        }}
      >
        Sign Out
      </button>
    </div>
  )
}
