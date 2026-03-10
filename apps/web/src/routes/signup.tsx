import { registerSchema } from "@app/schemas"
import { useProgress } from "@bprogress/react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { toast } from "react-toastify"
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
      onChange: registerSchema
    },
    onSubmit: async ({ value }) => {
      progress.start()
      const parsed = registerSchema.parse(value)
      const { error, data } = await signUp.email(parsed)
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
          <form.AppField name="name" children={field => <field.TextField label="Nane" />} />
          <form.AppField name="email" children={field => <field.EmailField label="Email" />} />
          <form.AppField
            name="password"
            children={field => <field.PasswordField label="Password" autoComplete="new-password" />}
          />
          <form.AppField name="image" children={field => <field.TextField label="Image" />} />
          <button type="submit">Submit</button>
        </form>
      </MainSection>
    </Main>
  )
}
