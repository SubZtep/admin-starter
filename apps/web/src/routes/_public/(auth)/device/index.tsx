import { createFileRoute, redirect, useNavigate, useSearch } from "@tanstack/react-router"
import { useState } from "react"
import { toast } from "react-toastify"
import { z } from "zod"
import { Button } from "#/components/form/primitives/Button"
import { Main } from "#/components/ui/Main"
import { Section } from "#/components/ui/Section"
import { useAuthClient } from "#/hooks/auth-client"

const deviceCodeSearchSchema = z.object({
  user_code: z.string().optional()
})

function formatUserCode(raw: string) {
  return raw.trim().replace(/-/g, "").toUpperCase()
}

export const Route = createFileRoute("/_public/(auth)/device/")({
  validateSearch: deviceCodeSearchSchema,
  beforeLoad: async ({ search }) => {
    const raw = search.user_code
    if (!raw) return
    const formatted = formatUserCode(raw)
    if (formatted.length < 4) return
    const apiUrl = process.env.API_URL || process.env.VITE_API_URL
    if (!apiUrl) return
    const res = await fetch(`${apiUrl.replace(/\/$/, "")}/auth/device?user_code=${encodeURIComponent(formatted)}`, {
      headers: { "Cache-Control": "no-store" }
    })
    if (!res.ok) return
    const body = (await res.json()) as { status?: string }
    if (body.status !== "pending") return
    throw redirect({
      to: "/device/approve",
      search: { user_code: formatted }
    })
  },
  component: DeviceCodePage
})

function DeviceCodePage() {
  const { user_code: userCodeParam } = useSearch({ from: "/_public/(auth)/device/" })
  const authClient = useAuthClient()
  const navigate = useNavigate()
  const [userCode, setUserCode] = useState(() => userCodeParam ?? "")
  const [loading, setLoading] = useState(false)

  async function login(code: string) {
    const formatted = formatUserCode(code)
    if (formatted.length < 4) {
      toast.error("Enter the code from your terminal")
      return
    }
    setLoading(true)
    try {
      const { data, error } = await authClient.device({
        query: { user_code: formatted }
      })
      if (error) {
        return void toast.error(error.statusText ?? "Invalid or expired code")
      }
      if (data) {
        await navigate({
          to: "/device/approve",
          search: { user_code: formatted }
        })
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    await login(userCode)
  }

  return (
    <Main>
      <Section className="max-w-lg">
        <h1 className="mb-4">Connect a device</h1>
        <p className="text-muted-foreground mb-4">Enter the code shown in your terminal.</p>
        <form onSubmit={onSubmit} className="flex flex-col gap-2">
          <input
            className="border border-input rounded-md px-3 py-2 bg-background"
            value={userCode}
            onChange={e => setUserCode(e.target.value)}
            placeholder="e.g. ABCD-1234"
            maxLength={16}
            autoComplete="one-time-code"
          />
          <Button type="submit" loading={loading}>
            Continue
          </Button>
        </form>
      </Section>
    </Main>
  )
}
