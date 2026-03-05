import { createFileRoute } from "@tanstack/react-router"
import { Profile } from "#/components/Profile"

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <h1 className="display-title">Dashboard</h1>
        <p className="my-3">Hello "/dashboard"!</p>
        <Profile />
      </section>
    </main>
  )
}
