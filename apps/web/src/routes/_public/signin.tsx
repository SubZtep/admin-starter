import { loginSchema } from "@app/schemas"
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { toast } from "react-toastify"
import { Button } from "#/components/form/primitives/Button"
import { Main } from "#/components/ui/Main"
import { Section } from "#/components/ui/Section"
import { ForgotPassword } from "#/components/user/ForgotPassword"
import { useAuthClient } from "#/hooks/auth-client"
import { useAppForm } from "#/lib/form"

export const Route = createFileRoute("/_public/signin")({
  component: SignIn
})

function SignIn() {
  const authClient = useAuthClient()
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
    onSubmit: async ({ value }) => {
      const parsed = loginSchema.safeParse(value)
      if (!parsed.success) {
        toast.error(parsed.error?.message ?? "Invalid data")
        return
      }

      try {
        setLoading(true)
        const { error } = await authClient.signIn.email({
          ...parsed.data,
          callbackURL: "/dashboard"
        })
        if (error) {
          toast.error(error.message ?? error.statusText)
        }
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
  })

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
          className="flex flex-col gap-2"
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

          <Button type="submit" loading={loading} className="mt-4 mb-1">
            Log me in
          </Button>

          <ForgotPassword getEmail={() => form.state.values.email}>
            <Button
              size="sm"
              variant="link"
              disabled={loading}
              className="hover:[text-decoration:underline_3px_var(--color-red-700)] hover:underline-offset-4"
            >
              Forgot my password
            </Button>
          </ForgotPassword>
        </form>
      </Section>
    </Main>
  )
}
