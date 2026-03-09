import { loginSchema } from "@app/schemas"
import { useProgress } from "@bprogress/react"
import { createFileRoute } from "@tanstack/react-router"
import { toast } from "react-toastify"
import { useAuthClient } from "#/hooks/auth-client"
import { useAppForm } from "#/lib/form"

export const Route = createFileRoute("/signin")({
  component: LogIn
})

function LogIn() {
  const { signIn } = useAuthClient()
  const progress = useProgress()

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
      const { error } = await signIn.email({
        ...parsed,
        callbackURL: "/dashboard"
      })
      if (error) toast.error(error.message)
      progress.stop()
    }
  })

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8 mx-auto max-w-lg">
        <h1 className="mb-4">Sign In</h1>

        <form
          onSubmit={e => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-1"
        >
          <form.AppField name="email" children={field => <field.EmailField label="Email" />} />
          <form.AppField name="password" children={field => <field.PasswordField label="Password" />} />
          <button type="submit">Submit</button>
        </form>
      </section>
    </main>
  )
}
