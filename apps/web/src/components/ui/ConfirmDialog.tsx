import { AlertDialog } from "@base-ui/react/alert-dialog"
import { Button } from "../form/primitives/Button"

interface Props {
  title: string
  onConfirm: () => void
  children: React.ReactElement
}

export function ConfirmDialog({ title, onConfirm, children }: Readonly<Props>) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger render={children} />
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 min-h-dvh bg-black transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 opacity-70 supports-[-webkit-touch-callout:none]:absolute" />
        <AlertDialog.Popup className="fixed top-1/2 left-1/2 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-800 p-6 text-gray-100 outline-1 outline-gray-300 transition-all duration-150 data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 ">
          <AlertDialog.Title className="-mt-1.5 mb-1 text-lg font-medium">{title}</AlertDialog.Title>
          <AlertDialog.Description className="mb-6 text-base text-gray-400">
            You can’t undo this action.
          </AlertDialog.Description>
          <div className="flex justify-end gap-4">
            <AlertDialog.Close render={<Button />}>Cancel</AlertDialog.Close>
            <AlertDialog.Close onClick={onConfirm} render={<Button className="text-red-400 font-semibold" autoFocus />}>
              Confirm
            </AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
