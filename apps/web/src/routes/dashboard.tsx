import { createFileRoute } from "@tanstack/react-router"
import { getApiUrl } from "#/lib/vars"

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent
})

const apiUrl = await getApiUrl()

function RouteComponent() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <h1>Dashboard</h1>
        <p className="my-3">
          Hello "/dashboard"!
          <br />
          API: {apiUrl}
        </p>
        <a href="http://localhost:3001/api/auth/reference" target="_blank" rel="noopener">
          Better Auth Swagger
        </a>
      </section>
    </main>
  )
}
