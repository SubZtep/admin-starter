import { changePasswordSchema, type EditEmailInput, editEmailSchema, editSchema } from "@app/schemas"
import { isImageUrl } from "@app/shared"
import { useProgress } from "@bprogress/react"
import { createFileRoute } from "@tanstack/react-router"
import type { User } from "better-auth"
import { toast } from "react-toastify"
import { Button } from "#/components/form/primitives/Button"
import { Loader } from "#/components/ui/Loader"
import { Main } from "#/components/ui/Main"
import { Section } from "#/components/ui/Section"
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
    <Main>
      <Section className="max-w-lg">
        <h1>Profile</h1>
        <p>
          Logged in with the {user.emailVerified ? "verified" : "unverified"} <strong>{user.email}</strong> as{" "}
          <strong>{user.role}</strong>.
        </p>
        <EditUser user={user} />
        <ChangeEmail />
        <ChangePassword />
      </Section>
    </Main>
  )
}

function EditUser({ user }: Readonly<{ user: User }>) {
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
    <div
      className="rounded-md"
      style={
        isImageUrl(user.image)
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('${user.image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }
          : undefined
      }
    >
      <h2>Edit Personal Data</h2>
      <form
        onSubmit={e => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="flex flex-col gap-1"
      >
        <form.AppField name="name">{field => <field.TextField label="Name" />}</form.AppField>
        <form.AppField name="image">{field => <field.TextField label="Image" />}</form.AppField>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}

function ChangeEmail() {
  const { changeEmail } = useAuthClient()
  const progress = useProgress()

  const form = useAppForm({
    defaultValues: {
      newEmail: "" as EditEmailInput["newEmail"]
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
        <form.AppField name="newEmail">{field => <field.TextField label="New email" type="email" />}</form.AppField>
        <Button type="submit">Submit</Button>
      </form>
    </>
  )
}

function ChangePassword() {
  const { changePassword } = useAuthClient()
  const progress = useProgress()

  const form = useAppForm({
    defaultValues: {
      newPassword: "",
      currentPassword: "",
      revokeOtherSessions: true
    },
    validators: {
      onSubmit: changePasswordSchema
    },
    onSubmit: async ({ value }) => {
      const parsed = changePasswordSchema.safeParse(value)
      if (!parsed.success) {
        toast.error(parsed.error?.message ?? "Invalid data")
        return
      }
      progress.start()
      const { error, data } = await changePassword({
        newPassword: parsed.data.newPassword,
        currentPassword: parsed.data.currentPassword,
        revokeOtherSessions: parsed.data.revokeOtherSessions
      })
      progress.stop()
      if (error) toast.error(error.message)
      if (data?.user) toast.success("Password changed")
    }
  })

  return (
    <>
      <h2>Change Password</h2>
      <form
        className="flex flex-col gap-1"
        onSubmit={e => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.AppField name="newPassword">
          {field => <field.TextField label="New password" type="password" autoComplete="new-password" />}
        </form.AppField>

        <form.AppField name="currentPassword">
          {field => <field.TextField label="Current password" type="password" autoComplete="new-password" />}
        </form.AppField>

        <form.AppField name="revokeOtherSessions">
          {field => (
            <field.CheckboxField label="Revoke other sessions" className="flex justify-end [&>label]:w-auto! mt-1" />
          )}
        </form.AppField>

        <Button type="submit">Submit</Button>
      </form>
    </>
  )
}
