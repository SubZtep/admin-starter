import { cn } from "@app/shared"
import { Button as BaseButton } from "@base-ui/react/button"
import { LoaderCircle } from "lucide-react"

const VARIANTS = {
  "3d": "border border-slate-700/50 bg-slate-900 hover:bg-slate-800",
  link: "mx-auto inline-block size-fit p-0! text-teal-400 underline hover:text-teal-300 hover:outline-0",
  oval: "rounded-full border border-slate-500/50 text-slate-400 hover:text-slate-100",
  primary: "bg-teal-400 text-slate-950 font-bold hover:bg-teal-300"
} as const

const SIZES = {
  sm: "rounded-md px-2 py-1 text-sm",
  md: "rounded-lg px-3 py-2.5",
  lg: "rounded-lg px-4 py-2.5 text-lg font-semibold"
} as const

const DEFAULT_CLASSES =
  "relative flex cursor-pointer items-center justify-center transition-all duration-100 focus:outline-2 focus:outline-teal-400/50 disabled:pointer-events-none disabled:opacity-50 active:scale-95"

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
      {loading && <LoaderCircle strokeWidth={3} className="absolute right-2 animate-spin text-current opacity-60" />}
    </BaseButton>
  )
}
