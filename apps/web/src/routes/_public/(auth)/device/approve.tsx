import { createFileRoute, useLoaderData, useNavigate, useSearch } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { z } from "zod"
import { Button } from "#/components/form/primitives/Button"
import { Main } from "#/components/ui/Main"
import { Section } from "#/components/ui/Section"
import { useAuthClient } from "#/hooks/auth-client"

export const Route = createFileRoute("/_public/(auth)/device/approve")({
  validateSearch: z.object({
    user_code: z.string().min(1)
  }),
  component: DeviceApprovePage
})

function DeviceApprovePage() {
  const { user_code } = useSearch({ from: "/_public/(auth)/device/approve" })
  const { session } = useLoaderData({ from: "__root__" })
  const authClient = useAuthClient()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session?.user) {
      const redirect = `/device/approve?user_code=${encodeURIComponent(user_code)}`
      navigate({
        to: "/signin",
        search: { redirect }
      })
    }
  }, [session?.user, user_code, navigate])

  if (!session?.user) {
    return null
  }

  async function approve() {
    setLoading(true)
    try {
      const { error } = await authClient.device.approve({ userCode: user_code })
      if (error) {
        toast.error(error.statusText ?? "Failed to approve")
        return
      }
      toast.success("Device approved — you can return to the CLI.")
      await navigate({ to: "/dashboard" })
    } finally {
      setLoading(false)
    }
  }

  async function deny() {
    setLoading(true)
    try {
      const { error } = await authClient.device.deny({ userCode: user_code })
      if (error) {
        toast.error(error.statusText ?? "Failed to deny")
        return
      }
      toast.info("Request denied.")
      await navigate({ to: "/dashboard" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Main>
      <Section className="max-w-lg">
        <h1 className="mb-4">Approve device</h1>
        <p className="text-muted-foreground mb-4">
          A CLI or device asked to use your account. Code: <strong className="text-foreground">{user_code}</strong>
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button type="button" loading={loading} onClick={approve}>
            Approve
          </Button>
          <Button type="button" variant="oval" disabled={loading} onClick={deny}>
            Deny
          </Button>
        </div>
      </Section>
    </Main>
  )
}
