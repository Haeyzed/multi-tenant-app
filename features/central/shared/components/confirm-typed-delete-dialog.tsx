"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"
import type { ReactNode } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Spinner } from "@/components/ui/spinner"

const DEFAULT_CONFIRM_WORD = "DELETE"

type ConfirmTypedDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description: ReactNode
  warning: ReactNode
  confirmLabel?: string
  confirmWord?: string
  onConfirm: () => void
  isPending?: boolean
  confirmDisabled?: boolean
}

/**
 * Shared typed-confirm delete dialog used by bulk delete actions.
 */
export function ConfirmTypedDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  warning,
  confirmLabel = "Delete",
  confirmWord = DEFAULT_CONFIRM_WORD,
  onConfirm,
  isPending = false,
  confirmDisabled = false,
}: ConfirmTypedDeleteDialogProps) {
  const [confirmValue, setConfirmValue] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setConfirmValue("")
    }
  }, [open])

  const canConfirm =
    confirmValue.trim() === confirmWord && !isPending && !confirmDisabled

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            {title}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>{description}</ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="space-y-4 py-2">
          <Label className="flex flex-col items-start gap-1.5">
            <span>Confirm by typing &quot;{confirmWord}&quot;:</span>
            <Input
              value={confirmValue}
              onChange={(event) => setConfirmValue(event.target.value)}
              placeholder={`Type "${confirmWord}" to confirm.`}
              autoFocus
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>{warning}</AlertDescription>
          </Alert>
        </div>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button
            variant="destructive"
            disabled={!canConfirm}
            onClick={onConfirm}
          >
            {isPending ? <Spinner /> : null}
            {confirmLabel}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
