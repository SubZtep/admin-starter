import { createFileRoute, Outlet } from "@tanstack/react-router"
import { Main } from "#/components/ui/Main"
// import { Footer } from "#/components/layout/Footer"
// import { Header } from "#/components/layout/Header"

export const Route = createFileRoute("/_public")({
  component: PublicLayout
})

function PublicLayout() {
  return (
    <div
      className="cursor-cell fixed inset-0 flex items-center justify-center min-h-screen min-w-full"
      style={{
        // backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* <Header /> */}
      {/* <Main className="flex items-center justify-center w-full h-full" onClick={e => e.stopPropagation()}> */}
      <Outlet />
      {/* </Main> */}
      {/* <Footer /> */}
    </div>
  )
}
