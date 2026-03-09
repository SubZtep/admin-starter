import { getFirstName } from "@app/shared"
import { createFileRoute } from "@tanstack/react-router"
import { useUser } from "#/hooks/user"
import { getApiUrl } from "#/lib/vars"

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent
})

const apiUrl = await getApiUrl()

function RouteComponent() {
  const { user } = useUser()

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <h1>Dashboard</h1>
        <p className="my-3">
          Hey{getFirstName(user?.name)}, the API base URL is <strong>{apiUrl}</strong>.
        </p>
      </section>
    </main>
  )
}
