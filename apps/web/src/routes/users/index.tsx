import { createFileRoute } from "@tanstack/react-router"
import { UsersAdminTemplate } from "#/components/admin/UsersAdminTemplate"
import { userRequired } from "#/lib/loaders"

export const Route = createFileRoute("/users/")({
  component: UserList,
  loader: () => userRequired("admin")
})

export function UserList() {
  return <UsersAdminTemplate />
}
