import { cn } from "@app/shared"
import { Checkbox as CheckboxBase } from "@base-ui/react/checkbox"
import { Check } from "lucide-react"
import type React from "react"

type Props = {
  name?: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  required?: boolean
  className?: string
  onBlur?: React.FocusEventHandler
  onCheckedChange?: (checked: boolean) => void
}

export function Checkbox({
  name,
  checked,
  defaultChecked,
  disabled,
  required,
  className,
  onBlur,
  onCheckedChange
}: Readonly<Props>) {
  return (
    <CheckboxBase.Root
      name={name}
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={disabled}
      required={required}
      onBlur={onBlur}
      onCheckedChange={onCheckedChange}
      className={cn(
        "flex size-5 cursor-pointer items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400/50 data-checked:border data-checked:border-teal-400/40 data-checked:bg-teal-400/20 data-unchecked:border data-unchecked:border-slate-500",
        className
      )}
    >
      <CheckboxBase.Indicator className="flex text-teal-400 data-unchecked:hidden">
        <Check size={18} strokeWidth={3} />
      </CheckboxBase.Indicator>
    </CheckboxBase.Root>
  )
}
