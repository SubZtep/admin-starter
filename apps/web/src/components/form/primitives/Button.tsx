import { cn } from "@app/shared"
import { Button as BaseButton } from "@base-ui/react/button"

const VARIANTS = {
  "3d": "border-2 border-gray-400 [border-style:outset] active:[border-style:double] active:border-[#5c5c5c] outline-1 bg-gray-800",
  oval: "border border-gray-500 rounded-full text-gray-300"
} as const

const SIZES = {
  sm: "rounded-sm px-1.5 text-sm",
  md: "rounded-md px-2 py-1.5"
} as const

const TYPES = {
  button: "outline-cyan-800/90",
  submit: "outline-amber-800/90 mt-3"
} as const

const DEFAULT_CLASSES =
  "flex items-center justify-center cursor-pointer transition-all duration-100 hover:outline-2 disabled:opacity-50 disabled:pointer-events-none"

export function Button({
  variant = "3d",
  size = "md",
  type = "button",
  focusableWhenDisabled,
  className,
  onClick,
  loading,
  children,
  ...props
}: Readonly<
  {
    variant?: keyof typeof VARIANTS
    size?: keyof typeof SIZES
    type?: "button" | "submit"
    focusableWhenDisabled?: boolean
    className?: string
    onClick?: () => void
    loading?: boolean
    children?: React.ReactNode
  } & React.ComponentProps<"button">
>) {
  return (
    <BaseButton
      type={type}
      className={cn(DEFAULT_CLASSES, SIZES[size], VARIANTS[variant], TYPES[type], className)}
      focusableWhenDisabled={focusableWhenDisabled}
      disabled={loading}
      onClick={onClick}
      {...props}
    >
      {loading ? "Submitting" : children || "Submit"}
    </BaseButton>
  )
}
