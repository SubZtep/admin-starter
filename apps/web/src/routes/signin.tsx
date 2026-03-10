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

      progress.start()
      const { error, data } = await signIn.email(parsed.data)
      progress.stop()

      if (error) toast.error(error.message)
      if (data?.user) navigate({ to: "/dashboard" })
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
          <form.AppField name="email" children={field => <field.TextField label="Email" type="email" />} />

          <form.AppField
            name="password"
            children={field => <field.TextField label="Password" type="password" autoComplete="current-password" />}
          />

          <form.AppField
            name="rememberMe"
            children={field => (
              <field.CheckboxField label="Remember Me" className="flex justify-end [&>label]:w-auto! mt-1" />
            )}
          />

          <Button type="submit">Log me in</Button>
        </form>
      </MainSection>
    </Main>
  )
}
