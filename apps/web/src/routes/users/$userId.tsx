import { getDateTime } from "@app/shared"
import { createFileRoute, useParams } from "@tanstack/react-router"
import type { UserWithRole } from "better-auth/plugins"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Loader } from "#/components/ui/Loader"
import { Main } from "#/components/ui/Main"
import { Section } from "#/components/ui/Section"
import { UserSessions } from "#/components/user/UserSessions"
import { useAuthClient } from "#/hooks/auth-client"
import { userRequired } from "#/lib/loaders"

export const Route = createFileRoute("/users/$userId")({
  component: UserPageComponent,
  loader: () => userRequired("admin")
})

function UserPageComponent() {
  const { userId } = useParams({ from: "/users/$userId" })
  const authClient = useAuthClient()
  const [user, setUser] = useState<UserWithRole>()

  useEffect(() => {
    void (async () => {
      const { data, error } = await authClient.admin.getUser({ query: { id: userId } })
      if (error) toast.error(error.message)
      if (data) setUser(data)
    })()
  }, [])

  if (!user) {
    return <Loader />
  }

  return (
    <Main className="grid grid-cols-2 grid-rows-2 gap-4 justify-items-stretch [&>section]:w-full">
      <Section>
        <h1>{user.name}</h1>
        <table className="table-auto">
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b border-gray-700">Email:</td>
              <td className="p-4 border-b border-gray-700">
                {user.email} ({user.emailVerified ? "verified" : "not verified"})
              </td>
            </tr>
            <tr>
              <td className="p-4 border-b border-gray-700">Created:</td>
              <td className="p-4 border-b border-gray-700">{getDateTime(user.createdAt, "long")}</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section>x</Section>

      <UserSessions userId={userId} className="col-span-2 row-start-2" />
    </Main>
  )
}
