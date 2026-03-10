import { registerSchema } from "@app/schemas"
import { useProgress } from "@bprogress/react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { toast } from "react-toastify"
import { Button } from "#/components/form/primitives/Button"
import { Main } from "#/components/ui/Main"
import { MainSection } from "#/components/ui/MainSection"
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
      <MainSection className="max-w-lg">
        <h1>Sign Up</h1>
        <p className="my-4">Enter your details:</p>

        <form
          onSubmit={e => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-1"
        >
          <form.AppField
            name="name"
            children={field => <field.TextField label="Name" placeholder="Enter your name" />}
          />

          <form.AppField name="email" children={field => <field.TextField label="Email" type="email" />} />

          <form.AppField
            name="password"
            children={field => <field.TextField label="Password" type="password" autoComplete="new-password" />}
          />

          <form.AppField
            name="image"
            children={field => <field.TextField label="Image" placeholder="Random anything" />}
          />

          <Button type="submit">Submit</Button>
        </form>
      </MainSection>
    </Main>
  )
}
