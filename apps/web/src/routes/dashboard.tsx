import { getFirstName } from "@app/shared"
import { createFileRoute } from "@tanstack/react-router"
import { Main } from "#/components/ui/Main"
import { Section } from "#/components/ui/Section"
import { userRequired } from "#/lib/loaders"

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  loader: () => userRequired()
})

function RouteComponent() {
  const user = Route.useLoaderData()

  return (
    <Main>
      <Section>
        <h1>Dashboard</h1>
        <p className="my-3">
          Hey{getFirstName(user.name)}, the {user.role}.
        </p>
      </Section>
    </Main>
  )
}
