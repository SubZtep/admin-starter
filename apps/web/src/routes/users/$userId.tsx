import { createFileRoute, useParams } from "@tanstack/react-router"
import type { UserWithRole } from "better-auth/plugins"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Loader } from "#/components/ui/Loader"
import { Main } from "#/components/ui/Main"
import { Section } from "#/components/ui/Section"
import { useAuthClient } from "#/hooks/auth-client"

export const Route = createFileRoute("/users/$userId")({
  component: UserComponent
})

function UserComponent() {
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
    <Main>
      <Section>
        <h1>{user.name}</h1>
        Email: {user.email} (user.emailVerified ? "verified" : "not verified")
        <br />
        Created: {new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeStyle: "full" }).format(user.createdAt)}
      </Section>

      <UserSessions userId={userId} />
    </Main>
  )
}

function UserSessions({ userId }: Readonly<{ userId: string }>) {
  const authClient = useAuthClient()
  const [sessions, setSessions] = useState<any>()

  useEffect(() => {
    void (async () => {
      const { data, error } = await authClient.admin.listUserSessions({ userId })
      if (error) toast.error(error.message)
      if (data) setSessions(data)
    })()
  }, [])

  return (
    <Section>
      <h2>Sessions</h2>
      <pre>{JSON.stringify(sessions, null, 2)}</pre>
    </Section>
  )
}
