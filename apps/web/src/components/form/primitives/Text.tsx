import { cn } from "@app/shared"
import { Input as BaseInput } from "@base-ui/react/input"
import { type ComponentProps, useEffect, useState } from "react"

const VARIANTS = {
  "3d": "w-full rounded-lg border border-slate-700/50 bg-slate-900 px-3 py-2 text-base text-slate-100 focus:outline-2 focus:-outline-offset-1 focus:outline-teal-400/50",
  simple: "rounded border border-slate-700/50 bg-slate-900 px-1 font-normal text-slate-400"
} as const

export function Text({
  variant,
  className,
  ...props
}: Readonly<{ variant?: keyof typeof VARIANTS; className?: string } & ComponentProps<"input">>) {
  return <BaseInput className={cn(variant && VARIANTS[variant], "dark:scheme-dark", className)} {...props} />
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
