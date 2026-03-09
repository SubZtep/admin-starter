import { useFieldContext } from "#/lib/form"
import { FieldErrors } from "./FieldErrors"

export function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>()
  return (
    <>
      <label>
        <span>{label}</span>
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
  )
}

export function EmailField({ label }: { label: string }) {
  const field = useFieldContext<string>()
  return (
    <>
      <label>
        <span>{label}</span>
        <input type="email" value={field.state.value} onChange={e => field.handleChange(e.target.value)} />
      </label>
      <FieldErrors field={field} />
    </>
  )
}
