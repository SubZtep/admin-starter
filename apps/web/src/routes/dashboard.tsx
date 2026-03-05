import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div>
      <h1 className="display-title">Dashboard</h1>
      <p>Hello "/dashboard"!</p>
    </div>
  )
}
