import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, ErrorComponent, HeadContent, Scripts } from "@tanstack/react-router"
import { Providers } from "#/components/Providers"
import { Footer } from "../components/layout/Footer"
import { Header } from "../components/layout/Header"
import { getSession } from "../lib/session"
import appCss from "../styles.css?url"

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async () => {
    const session = await getSession()
    return {
      apiUrl: process.env.API_URL!,
      session
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
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png"
      },
      {
        rel: "manifest",
        href: "/site.webmanifest"
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
      }
    ]
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
  errorComponent: DefaultError
})

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="isolate">
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

function DefaultError({ error }: Readonly<{ error: Error }>) {
  return (
    <div className="flex flex-col items-center py-24">
      <ErrorComponent error={error} />
    </div>
  )
}
