import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { EmailField, TextField } from "#/components/form/profile"

export const { fieldContext, formContext, useFieldContext } = createFormHookContexts()

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    EmailField,
    TextField
  },
  formComponents: {}
})
