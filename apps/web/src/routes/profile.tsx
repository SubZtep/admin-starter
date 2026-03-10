import { editEmailSchema, editSchema } from "@app/schemas"
import { useProgress } from "@bprogress/react"
import { createFileRoute } from "@tanstack/react-router"
import type { User } from "better-auth"
import { toast } from "react-toastify"
import { Button } from "#/components/form/primitives/Button"
import { Loader } from "#/components/ui/Loader"
import { Main } from "#/components/ui/Main"
import { MainSection } from "#/components/ui/MainSection"
import { useAuthClient } from "#/hooks/auth-client"
import { useUser } from "#/hooks/user"
import { useAppForm } from "#/lib/form"

export const Route = createFileRoute("/profile")({
  component: Profile
})

function Profile() {
  const { user, isLoading } = useUser()
  if (isLoading) return <Loader />
  if (!user) throw new Error("Not logged in")

  return (
    <Main
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('https://assets.4cdn.hu/kraken/8JYrNPx4a8SdJ1Ahs.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <MainSection className="max-w-lg">
        <h1>Profile</h1>
        <p>
          Logged in with the {user.emailVerified ? "verified" : "unverified"} <strong>{user.email}</strong> as{" "}
          <strong>{user.role}</strong>.
        </p>
        <EditUser user={user} />
        <EditEmail user={user} />
      </MainSection>
    </Main>
  )
}

function EditUser({ user }: { user: User }) {
  const { updateUser } = useAuthClient()
  const progress = useProgress()

  const form = useAppForm({
    defaultValues: {
      name: user?.name,
      image: user?.image
    },
    validators: {
      onSubmit: editSchema
    },
    onSubmit: async ({ value }) => {
      const parsed = editSchema.parse(value)
      progress.start()
      const { error, data } = await updateUser(parsed)
      progress.stop()
      if (error) toast.error(error.message)
      if (data?.status) toast.success("User updated")
    }
  })

  return (
    <>
      <h2>Edit Personal Data</h2>
      <form
        onSubmit={e => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="flex flex-col gap-1"
      >
        <form.AppField name="name" children={field => <field.TextField label="Name" />} />
        <form.AppField name="image" children={field => <field.TextField label="Image" />} />
        <Button type="submit">Submit</Button>
      </form>
    </>
  )
}

function EditEmail({ user }: { user: User }) {
  const { changeEmail } = useAuthClient()
  const progress = useProgress()

  const form = useAppForm({
    defaultValues: {
      newEmail: user?.email
    },
    validators: {
      onSubmit: editEmailSchema
    },
    onSubmit: async ({ value }) => {
      const parsed = editEmailSchema.safeParse(value)
      if (!parsed.success) {
        toast.error(parsed.error?.message ?? "Invalid data")
        return
      }
      progress.start()
      const { error, data } = await changeEmail(parsed.data)
      progress.stop()
      if (error) toast.error(error.message)
      if (data?.status) toast.success("User email updated")
    }
  })

  return (
    <>
      <h2>Change Email</h2>
      <form
        onSubmit={e => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="flex flex-col gap-1"
      >
        <form.AppField name="newEmail" children={field => <field.TextField label="Email" type="email" />} />
        <Button type="submit">Submit</Button>
      </form>
    </>
  )
}
