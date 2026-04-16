import { cn } from "@app/shared"
import { Button as BaseButton } from "@base-ui/react/button"
import { LoaderCircle } from "lucide-react"

const VARIANTS = {
  "3d": "border border-outline-variant/50 bg-surface-container hover:bg-surface-container-high",
  link: "inline-block underline text-primary hover:text-primary/80 size-fit mx-auto p-0! hover:outline-0",
  oval: "border border-outline/50 rounded-full text-on-surface-variant hover:text-on-surface",
  primary: "bg-primary text-on-primary font-bold hover:opacity-90"
} as const

const SIZES = {
  sm: "rounded-md px-2 py-1 text-sm",
  md: "rounded-lg px-3 py-2.5",
  lg: "rounded-lg px-4 py-2.5 text-lg font-semibold"
} as const

const DEFAULT_CLASSES =
  "relative flex items-center justify-center cursor-pointer transition-all duration-100 focus:outline-2 focus:outline-primary/50 disabled:opacity-50 disabled:pointer-events-none active:scale-95"

export function Button({
  variant = "3d",
  size = "md",
  type = "button",
  focusableWhenDisabled,
  className,
  onClick,
  loading,
  disabled,
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
      className={cn(DEFAULT_CLASSES, size && SIZES[size], VARIANTS[variant], className)}
      focusableWhenDisabled={focusableWhenDisabled}
      disabled={loading || disabled}
      onClick={onClick}
      {...props}
    >
      {children}
      {loading && <LoaderCircle strokeWidth={3} className="animate-spin absolute right-2 opacity-60 text-primary" />}
    </BaseButton>
  )
}
