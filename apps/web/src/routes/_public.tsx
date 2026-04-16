import { createFileRoute, Outlet } from "@tanstack/react-router"
import { Footer } from "#/components/layout/Footer"
import { Header } from "#/components/layout/Header"

export const Route = createFileRoute("/_public")({
  component: PublicLayout
})

function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}
