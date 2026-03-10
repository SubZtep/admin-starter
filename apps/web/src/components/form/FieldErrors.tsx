import type { AnyFieldApi } from "@tanstack/react-form"

/** Displays field error messages when present. */
export function FieldErrors({ field }: { field: AnyFieldApi }) {
  if (field.state.meta.isValid) {
    return null
  }

  return (
    <div className="border border-red-500 bg-red-950 text-red-50 rounded-sm text-sm my-1 px-1">
      <ul>
        {field.state.meta.errors
          .map(error => error?.message)
          .map(message => (
            <li key={message}>{message}</li>
          ))}
      </ul>
    </div>
  )
}
