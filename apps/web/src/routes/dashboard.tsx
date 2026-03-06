import { createFileRoute } from "@tanstack/react-router"
import { Profile } from "#/components/Profile"
import { UserList } from "#/components/UserList"

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <h1>Dashboard</h1>
        <p className="my-3">
          Hello "/dashboard"! -{" "}
          <a href="http://localhost:3001/api/auth/reference" target="_blank" rel="noopener">
            Better Auth Swagger
          </a>
        </p>
        <Profile />
        <UserList />
      </section>
    </main>
  )
}
