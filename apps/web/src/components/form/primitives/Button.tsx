import { cn } from "@app/shared"
import { Button as BaseButton } from "@base-ui/react/button"

const VARIANTS = {
  "3d": "border-outset bg-gray-800"
} as const

const SIZES = {
  sm: "rounded-sm px-1.5 py-0.5 text-sm",
  md: "rounded-md px-2 py-1"
} as const

const TYPES = {
  button: "outline-cyan-800/90",
  submit: "outline-amber-800/90 mt-3"
} as const

const DEFAULT_CLASSES = "flex items-center justify-center cursor-pointer transition-all duration-100 hover:outline-2"

export function Button({
  variant = "3d",
  size = "md",
  type = "button",
  className,
  onClick,
  loading,
  children,
  ...props
}: {
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
  type?: "button" | "submit"
  className?: string
  onClick?: () => void
  loading?: boolean
  children?: React.ReactNode
} & React.ComponentProps<"button">) {
  return (
    <BaseButton
      type={type}
      className={cn(DEFAULT_CLASSES, SIZES[size], VARIANTS[variant], TYPES[type], className)}
      disabled={loading}
      focusableWhenDisabled
      onClick={onClick}
      {...props}
    >
      {loading ? "Submitting" : children || "Submit"}
    </BaseButton>
  )
}
