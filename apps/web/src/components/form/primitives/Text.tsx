import { Input as BaseInput } from "@base-ui/react/input"

export function Text(props: Readonly<React.ComponentProps<"input">>) {
  return (
    <BaseInput
      className="py-1 px-2.5 border-2 border-black [border-style:inset] text-base bg-[#333] text-white focus:outline-2 focus:-outline-offset-1 focus:outline-blue-800 rounded-md w-full"
      {...props}
    />
  )
}
