import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_public/device")({
  component: () => <Outlet />
})
