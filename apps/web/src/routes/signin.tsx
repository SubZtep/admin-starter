import { loginSchema } from "@app/schemas"
import { useProgress } from "@bprogress/react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button } from "#/components/form/primitives/Button"
import { Main } from "#/components/ui/Main"
import { Section } from "#/components/ui/Section"
import { useAuthClient } from "#/hooks/auth-client"
import { useAppForm } from "#/lib/form"

export const Route = createFileRoute("/signin")({
  component: SignIn
})

function SignIn() {
  const authClient = useAuthClient()
  const progress = useProgress()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true
    },
    validators: {
      onSubmit: loginSchema
    },
    onSubmit: async ({ value, meta }) => {
      const parsed = loginSchema.safeParse(value)
      if (!parsed.success) {
        toast.error(parsed.error?.message ?? "Invalid data")
        return
      }

      try {
        setLoading(true)

        // @ts-ignore
        switch (meta.action) {
          case "login":
            await authClient.signIn.email(parsed.data)
            navigate({ to: "/dashboard" })
            break
          case "forgot": {
            const { data, error } = await authClient.requestPasswordReset({ email: parsed.data.email })
            if (error) toast.error(error.message)
            if (data) toast.info(data.message)
            break
          }
        }
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
  })

  useEffect(() => {
    if (loading) {
      progress.start()
    } else {
      progress.stop()
    }
  }, [loading])

  return (
    <Main>
      <Section className="max-w-lg">
        <h1 className="mb-4">Sign In</h1>

        <form
          onSubmit={event => {
            event.preventDefault()
            const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
            form.handleSubmit({ action: submitter?.value })
          }}
          className="flex flex-col gap-1"
        >
          <form.AppField name="email">
            {field => <field.TextField label="Email" type="email" autoComplete="email" />}
          </form.AppField>

          <form.AppField name="password">
            {field => <field.TextField label="Password" type="password" autoComplete="current-password" />}
          </form.AppField>

          <form.AppField name="rememberMe">
            {field => <field.CheckboxField label="Remember Me" className="flex justify-end [&>label]:w-auto! mt-1" />}
          </form.AppField>

          <Button type="submit" value="login" disabled={loading} className="mt-4 mb-1">
            Log me in
          </Button>

          <Button type="submit" value="forgot" variant="link" size="sm" disabled={loading}>
            Forgot my password
          </Button>
        </form>
      </Section>
    </Main>
  )
}
