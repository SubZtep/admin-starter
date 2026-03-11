import { ProgressProvider } from "@bprogress/react"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { FormDevtoolsPanel } from "@tanstack/react-form-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import type { ReactNode } from "react"
import { ToastContainer } from "react-toastify"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider color="#e60076" shallowRouting>
      <TanStackQueryProvider>
        {children}

        <ToastContainer theme="colored" />
        <TanStackDevtools
          config={{
            position: "bottom-right"
          }}
          plugins={[
            {
              name: "Tanstack Form",
              render: <FormDevtoolsPanel />
            },
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />
            },
            {
              name: "Tanstack Query",
              render: <ReactQueryDevtoolsPanel />
            }
          ]}
        />
      </TanStackQueryProvider>
    </ProgressProvider>
  )
}

let context:
  | {
      queryClient: QueryClient
    }
  | undefined

export function getContext() {
  if (context) {
    return context
  }

  const queryClient = new QueryClient()

  context = {
    queryClient
  }

  return context
}

function TanStackQueryProvider({ children }: { children: ReactNode }) {
  const { queryClient } = getContext()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
