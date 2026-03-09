import { useFieldContext } from "#/lib/form"

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
      {!field.state.meta.isValid && <em>{field.state.meta.errors.map(error => error?.message).join(", ")}</em>}
    </>
  )
}

export function EmailField({ label }: { label: string }) {
  const field = useFieldContext<string>()
  return (
    <label>
      <span>{label}</span>
      <input type="email" value={field.state.value} onChange={e => field.handleChange(e.target.value)} />
    </label>
  )
}
