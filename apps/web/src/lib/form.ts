import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { EmailField } from "#/components/form/EmailField"
import { PasswordField } from "#/components/form/PasswordField"
import { TextField } from "#/components/form/TextField"

export const { fieldContext, formContext, useFieldContext } = createFormHookContexts()

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    EmailField,
    PasswordField,
    TextField
  },
  formComponents: {}
})
