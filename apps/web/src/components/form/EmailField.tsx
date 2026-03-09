import type { JSX } from "react"
import { useFieldContext } from "#/lib/form"
import { FieldErrors } from "./FieldErrors"

export function EmailField({
  label,
  autoComplete = "off",
  ...props
}: { label: string; autoComplete?: string } & JSX.IntrinsicElements["input"]) {
  const id = props.id ?? label
  const field = useFieldContext<string>()

  return (
    <>
      <div className="flex">
        <label htmlFor={id} className="w-8">
          {label}
        </label>
        <input
          id={id}
          type="email"
          autoComplete={autoComplete}
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
