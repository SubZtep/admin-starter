import { loginSchema } from "@app/schemas"
import { useForm } from "@tanstack/react-form"
import { createFileRoute } from "@tanstack/react-router"
import { toast } from "react-toastify"
import { useAuthClient } from "#/hooks/auth-client"

export const Route = createFileRoute("/signin")({
  component: LogIn
})

function LogIn() {
  const { signIn } = useAuthClient()

  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    validators: {
      onChange: loginSchema
    },
    onSubmit: async ({ value }) => {
      const { success, data } = loginSchema.safeParse(value)
      if (!success) {
        return alert("Data error")
      }

      await signIn.email(
        {
          ...data,
          callbackURL: "/dashboard"
        },
        {
          onRequest: ctx => {
            //show loading
            console.log("Loading", ctx)
          },
          onSuccess: ctx => {
            console.log("SUCCESS", JSON.stringify(ctx.data, null, 2))
          },
          onError: ctx => {
            toast.error(ctx.error.message)
          }
        }
      )
    }
  })

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <h1 className="mb-4">Sign In</h1>

        <form
          onSubmit={e => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
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
                {!field.state.meta.isValid && (
                  <em>{field.state.meta.errors.map(error => error?.message).join(", ")}</em>
                )}
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
                  />
                </label>
                {!field.state.meta.isValid && (
                  <em>{field.state.meta.errors.map(error => error?.message).join(", ")}</em>
                )}
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
