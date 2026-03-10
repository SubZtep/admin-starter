import { cn } from "@app/shared"

const ISLAND_SHELL_CLASSES =
  "border border-[var(--line)] bg-[linear-gradient(165deg,var(--surface-strong),var(--surface))] shadow-[0_1px_0_var(--inset-glint)_inset,0_22px_44px_rgba(30,90,72,0.1),0_6px_18px_rgba(23,58,64,0.08)] backdrop-blur-[4px] transxxxition-[background-color_180ms_ease,color_180ms_ease,border-color_180ms_ease,transform_180ms_ease]"

export function MainSection({
  className,
  style,
  children
}: {
  className?: string
  style?: CSSProperties
  children: React.ReactNode
}) {
  return (
    <section className={cn(ISLAND_SHELL_CLASSES, "rounded-2xl p-6 sm:p-8 mx-auto", className)} style={style}>
      {children}
    </section>
  )
}
