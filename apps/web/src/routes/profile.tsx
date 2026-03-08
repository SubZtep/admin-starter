import { createFileRoute } from "@tanstack/react-router"
import Loader from "#/components/Loader"
import { useUser } from "#/hooks/user"

export const Route = createFileRoute("/profile")({
  component: Profile
})

function Profile() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return <Loader />
  }

  if (!user) {
    return <div>Not logged in</div>
  }

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <h1>Profile</h1>
        <p>Logged in as:</p>
        <pre className="my-3">{JSON.stringify(user, null, 2)}</pre>
      </section>
    </main>
  )
}
