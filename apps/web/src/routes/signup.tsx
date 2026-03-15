import { registerSchema } from "@app/schemas"
import { useProgress } from "@bprogress/react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { toast } from "react-toastify"
import { Button } from "#/components/form/primitives/Button"
import { Main } from "#/components/ui/Main"
import { Section } from "#/components/ui/Section"
import { useAuthClient } from "#/hooks/auth-client"
import { useAppForm } from "#/lib/form"

export const Route = createFileRoute("/signup")({
  component: SignUp
})

function SignUp() {
  const progress = useProgress()
  const navigate = useNavigate()
  const { signUp } = useAuthClient()

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: ""
    },
    validators: {
      onSubmit: registerSchema
    },
    onSubmit: async ({ value }) => {
      const parsed = registerSchema.safeParse(value)
      if (!parsed.success) {
        toast.error(parsed.error?.message ?? "Invalid data")
        return
      }

      progress.start()
      const { error, data } = await signUp.email(parsed.data)
      progress.stop()

      if (error) toast.error(error.message)
      if (data?.user) {
        toast.success("User registered")
        navigate({ to: "/dashboard" })
      }
    }
  })

  return (
    <Main>
      <Section className="max-w-lg">
        <h1>Sign Up</h1>
        <p className="my-4">Enter your details:</p>

        <form
          onSubmit={e => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-2"
        >
          <form.AppField name="name">
            {field => <field.TextField label="Name" placeholder="Enter your name" />}
          </form.AppField>

          <form.AppField name="email">
            {field => <field.TextField label="Email" type="email" placeholder="Enter your email" />}
          </form.AppField>

          <form.AppField name="password">
            {field => <field.TextField label="Password" type="password" autoComplete="new-password" />}
          </form.AppField>

          <form.AppField name="image">
            {field => <field.TextField label="Image" placeholder="Anything" />}
          </form.AppField>

          <Button type="submit" className="mt-3">
            Submit
          </Button>
        </form>
      </Section>
    </Main>
  )
}
