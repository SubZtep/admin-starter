import { createFileRoute, Outlet } from "@tanstack/react-router"
import { MobileNav } from "#/components/layout/MobileNav"
import { Sidebar } from "#/components/layout/Sidebar"
import { userRequired } from "#/lib/loaders"

export const Route = createFileRoute("/_admin")({
  component: AdminLayoutRoute,
  loader: () => userRequired()
})

function AdminLayoutRoute() {
  return (
    <>
      <Sidebar />
      <main className="md:ml-64 min-h-screen p-6 md:p-10 pb-24 md:pb-10 bg-background">
        <Outlet />
      </main>
      <MobileNav />
    </>
  )
}
