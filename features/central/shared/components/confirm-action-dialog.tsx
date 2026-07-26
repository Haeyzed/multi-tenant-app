"use client"

import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
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

type ConfirmActionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description: ReactNode
  confirmLabel: string
  onConfirm: () => void
  isPending?: boolean
  confirmDisabled?: boolean
  variant?: "default" | "destructive"
  cancelLabel?: string
  children?: ReactNode
}

/**
 * Shared confirm dialog for delete / lifecycle actions across CRUD modules.
 */
export function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  isPending = false,
  confirmDisabled = false,
  variant = "default",
  cancelLabel = "Cancel",
  children,
}: ConfirmActionDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>{description}</ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        {children}
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">{cancelLabel}</Button>}
          />
          <Button
            variant={variant}
            disabled={isPending || confirmDisabled}
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
