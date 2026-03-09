import type { JSX } from "react"
import { useFieldContext } from "#/lib/form"
import { FieldErrors } from "./FieldErrors"

export function PasswordField({ label, ...props }: { label: string } & JSX.IntrinsicElements["input"]) {
  const id = props.id ?? label
  const field = useFieldContext<string>()

  return (
    <>
      <div className="flex">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="password"
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={e => field.handleChange(e.target.value)}
          {...props}
        />
      </div>
      <FieldErrors field={field} />
    </>
  )
}
