import { loginSchema } from "@app/schemas"
import { useProgress } from "@bprogress/react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { toast } from "react-toastify"
import { Button } from "#/components/form/primitives/Button"
import { Main } from "#/components/ui/Main"
import { MainSection } from "#/components/ui/MainSection"
import { useAuthClient } from "#/hooks/auth-client"
import { useAppForm } from "#/lib/form"

export const Route = createFileRoute("/signin")({
  component: LogIn
})

function LogIn() {
  const { signIn } = useAuthClient()
  const progress = useProgress()
  const navigate = useNavigate()

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: ""
    },
    validators: {
      onChange: loginSchema
    },
    onSubmit: async ({ value }) => {
      progress.start()
      const parsed = loginSchema.parse(value)
      const { error } = await signIn.email(parsed)
      if (error) toast.error(error.message)
      progress.stop()
      navigate({ to: "/dashboard" })
    }
  })

  return (
    <Main>
      <MainSection className="max-w-lg">
        <h1 className="mb-4">Sign In</h1>

        <form
          onSubmit={e => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-1"
        >
          <form.AppField name="email" children={field => <field.EmailField label="Email" />} />
          <form.AppField
            name="password"
            children={field => <field.PasswordField label="Password" autoComplete="current-password" />}
          />
          <Button type="submit">Log me in</Button>
        </form>
      </MainSection>
    </Main>
  )
}
