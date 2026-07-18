"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"

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
import { usePermissions } from "@/features/central/permissions/components/permissions-provider"
import { useDeleteManyPermissions } from "@/features/central/permissions/hooks/use-permission-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

const CONFIRM_WORD = "DELETE"

export function PermissionsBulkDialogs() {
  const { open, setOpen, bulkSelection, setBulkSelection } = usePermissions()
  const deleteMany = useDeleteManyPermissions()
  const [confirmValue, setConfirmValue] = React.useState("")

  const ids = bulkSelection?.ids ?? []
  const count = ids.length

  const handleClose = React.useCallback(() => {
    setOpen(null)
    setConfirmValue("")
    setTimeout(() => {
      setBulkSelection(null)
    }, 300)
  }, [setOpen, setBulkSelection])

  const finishSuccess = (message?: string, fallback?: string) => {
    toastApiSuccess(message, fallback)
    bulkSelection?.onComplete?.()
    handleClose()
  }

  return (
    <ResponsiveDialog
      open={open === "deleteMany"}
      onOpenChange={(val) => {
        if (!val) {
          handleClose()
        }
      }}
    >
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="size-5" />
            Delete {count} {count === 1 ? "permission" : "permissions"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Permanently delete the selected permissions from the catalog.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="space-y-4 py-2">
          <Label className="flex flex-col items-start gap-1.5">
            <span>Confirm by typing &quot;{CONFIRM_WORD}&quot;:</span>
            <Input
              value={confirmValue}
              onChange={(event) => setConfirmValue(event.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
              autoFocus
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Roles and users that reference these permissions will lose them.
            </AlertDescription>
          </Alert>
        </div>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button
            variant="destructive"
            disabled={confirmValue.trim() !== CONFIRM_WORD || deleteMany.isPending}
            onClick={() => {
              deleteMany.mutate(ids, {
                onSuccess: (result) =>
                  finishSuccess(
                    result.message,
                    `Deleted ${count} ${count === 1 ? "permission" : "permissions"}`
                  ),
                onError: (error) =>
                  toastApiError(error, "Failed to delete permissions"),
              })
            }}
          >
            {deleteMany.isPending ? <Spinner /> : null}
            Delete
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
