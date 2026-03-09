import { registerSchema } from "@app/schemas"
import { useProgress } from "@bprogress/react"
import { useForm } from "@tanstack/react-form"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { toast } from "react-toastify"
import { FieldErrors } from "#/components/form/FieldErrors"
import { useAuthClient } from "#/hooks/auth-client"

export const Route = createFileRoute("/signup")({
  component: SignUp
})

function SignUp() {
  const progress = useProgress()
  const navigate = useNavigate()
  const { signUp } = useAuthClient()

  const form = useForm({
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
      const parsed = registerSchema.parse(value)
      await signUp.email(parsed, {
        onRequest() {
          progress.start()
        },
        onSuccess() {
          progress.stop()
          toast.success("User registered")
          navigate({ to: "/dashboard" })
        },
        onError: ctx => {
          progress.stop()
          toast.error(ctx.error.message)
        }
      })
    }
  })

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <h1>Sign Up</h1>
        <p className="my-4">Enter your details:</p>
        <form
          onSubmit={e => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <form.Field
            name="name"
            children={field => (
              <>
                <label>
                  Name:
                  <input
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                  />
                </label>
                <FieldErrors field={field} />
              </>
            )}
          />

          <form.Field
            name="email"
            children={field => (
              <>
                <label>
                  Email:
                  <input
                    type="email"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                  />
                </label>
                <FieldErrors field={field} />
              </>
            )}
          />

          <form.Field
            name="password"
            children={field => (
              <>
                <label>
                  Password:
                  <input
                    type="password"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    autoComplete="new-password"
                  />
                </label>
                <FieldErrors field={field} />
              </>
            )}
          />

          <form.Field
            name="image"
            children={field => (
              <>
                <label>
                  Image:
                  <input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    type="text"
                    onChange={e => field.handleChange(e.target.value)}
                  />
                </label>
                <FieldErrors field={field} />
              </>
            )}
          />

          <br />
          <button type="submit">Submit</button>
        </form>
      </section>
    </main>
  )
}
