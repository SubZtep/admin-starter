import { getFirstName } from "@app/shared"
import { createFileRoute } from "@tanstack/react-router"
import { Main } from "#/components/ui/Main"
import { MainSection } from "#/components/ui/MainSection"
import { useUser } from "#/hooks/user"
import { getApiUrl } from "#/lib/vars"

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent
})

const apiUrl = await getApiUrl()

function RouteComponent() {
  const { user } = useUser()

  return (
    <Main>
      <MainSection>
        <h1>Dashboard</h1>
        <p className="my-3">
          Hey{getFirstName(user?.name)}, the API base URL is <strong>{apiUrl}</strong>.
        </p>
      </MainSection>
    </Main>
  )
}
