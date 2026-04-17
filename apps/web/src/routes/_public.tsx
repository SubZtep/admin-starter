import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_public")({
  component: PublicLayout
})

function PublicLayout() {
  return (
    <div
      className='cursor-[url("/favicon-16x16.png")_16_16,auto] fixed inset-0 flex items-center justify-center min-h-screen min-w-full'
      // style={{
      //   backgroundImage: "url('/bg.png')",
      //   backgroundSize: "cover",
      //   backgroundPosition: "center"
      // }}
    >
      <Outlet />
    </div>
  )
}
