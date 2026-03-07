import { registerSchema } from "@app/schemas"
import { useForm } from "@tanstack/react-form"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { toast } from "react-toastify"
import { authClient } from "../lib/auth"

export const Route = createFileRoute("/signup")({
  component: SignUp
})

function SignUp() {
  const navigate = useNavigate()

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
      const { success, data } = registerSchema.safeParse(value)
      if (!success) {
        return alert("Data error")
      }

      await authClient.signUp.email(data, {
        onRequest: ctx => {
          //show loading
          console.log("Loading", ctx)
        },
        onSuccess: _ctx => {
          toast.success("User registered")
          navigate({ to: "/dashboard" })
        },
        onError: ctx => {
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
                {!field.state.meta.isValid && (
                  <em>{field.state.meta.errors.map(error => error?.message).join(", ")}</em>
                )}
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
                    autoComplete="new-password"
                  />
                </label>
                {!field.state.meta.isValid && (
                  <em>{field.state.meta.errors.map(error => error?.message).join(", ")}</em>
                )}
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
