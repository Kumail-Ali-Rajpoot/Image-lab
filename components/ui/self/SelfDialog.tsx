import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type {ReactNode} from 'react'

interface props {
    children:ReactNode
    title:string
    description:string
    actionTitle?:string
    cancelTitle?:string
    onlyOk?:boolean
}

export function SelfDialog({children,title,description,actionTitle ="OK",cancelTitle ="Cancel",onlyOk}:props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="border rounded-none bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-mono text-md border-b border-l px-2 w-full">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm border p-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        {
            onlyOk?(
                <AlertDialogAction>{actionTitle}</AlertDialogAction>
            ):(
                <>
                <AlertDialogCancel>{cancelTitle}</AlertDialogCancel>
                <AlertDialogAction>{actionTitle}</AlertDialogAction>
                </>
            )
        }
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
