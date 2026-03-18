import { cn } from "@app/shared"
import { Input as BaseInput } from "@base-ui/react/input"
import { type ComponentProps, useEffect, useState } from "react"

const VARIANTS = {
  "3d": "py-2 px-3 border-2 border-black [border-style:inset] text-base bg-gray-700 text-white focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800/70 rounded-md w-full",
  simple: "bg-gray-800 text-gray-300 font-normal px-1"
} as const

export function Text({
  variant,
  className,
  ...props
}: Readonly<{ variant?: keyof typeof VARIANTS; className?: string } & ComponentProps<"input">>) {
  return <BaseInput className={cn(variant && VARIANTS[variant], className)} {...props} />
}

export function DebouncedText({
  value: initialValue,
  debounce = 500,
  onChange,
  ...props
}: Readonly<
  { debounce?: number; onChange: (value: string | number) => void; value: string | number } & Omit<
    ComponentProps<typeof Text>,
    "value" | "onChange"
  >
>) {
  const [value, setValue] = useState<string | number>(initialValue)

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange?.(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return <Text onChange={event => setValue(event.target.value)} {...props} />
}
