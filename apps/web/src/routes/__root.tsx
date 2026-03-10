import progressCss from "@bprogress/core/css?url"
import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, ErrorComponent, HeadContent, Scripts } from "@tanstack/react-router"
import { Providers } from "#/components/Providers"
import Footer from "../components/layout/Footer"
import Header from "../components/layout/Header"
import appCss from "../styles.css?url"

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: () => {
    return {
      apiUrl: process.env.API_URL
    }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "Admin Starter"
      },
      {
        name: "og:title",
        content: "Admin Starter"
      },
      {
        name: "twitter:title",
        content: "Admin Starter"
      },
      {
        name: "og:url",
        content: "https://subztep.github.io/admin-starter/"
      },
      {
        name: "twitter:url",
        content: "https://subztep.github.io/admin-starter/"
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      },
      {
        rel: "stylesheet",
        href: progressCss
      }
    ]
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
  errorComponent: DefaultError
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      {/* <body className="font-sans antialiased wrap-anywhere selection:bg-[#ff69b4] selection:text-black"> */}
      <body>
        <div className="root">
          <Providers>
            <Header />
            {children}
            <Footer />
          </Providers>
        </div>
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <p className="text-center my-28 text-red-500 text-xl font-bold text-shadow-sm text-shadow-green-700">
      Sorry, this page doesn’t exist.
    </p>
  )
}

function DefaultError({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center py-24">
      <ErrorComponent error={error} />
    </div>
  )
}
