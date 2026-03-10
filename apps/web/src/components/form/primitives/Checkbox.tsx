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
}: Props) {
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
        "cursor-pointer flex size-5 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-checked:bg-gray-900 data-unchecked:border data-unchecked:border-gray-300",
        className
      )}
    >
      <CheckboxBase.Indicator className="flex text-gray-50 data-unchecked:hidden">
        <Check size={18} strokeWidth={3} />
      </CheckboxBase.Indicator>
    </CheckboxBase.Root>
  )
}
