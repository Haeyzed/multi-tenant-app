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
import { useRoles } from "@/features/central/roles/components/roles-provider"
import { useDeleteManyRoles } from "@/features/central/roles/hooks/use-role-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

const CONFIRM_WORD = "DELETE"

export function RolesBulkDialogs() {
  const { open, setOpen, bulkSelection, setBulkSelection } = useRoles()
  const deleteMany = useDeleteManyRoles()
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
            Delete {count} {count === 1 ? "role" : "roles"}
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Delete the selected roles. Users assigned to them will lose those
            roles. The super-admin role is excluded from bulk delete.
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
              This permanently removes the selected roles and their permission
              assignments.
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
                    `Deleted ${count} ${count === 1 ? "role" : "roles"}`
                  ),
                onError: (error) =>
                  toastApiError(error, "Failed to delete roles"),
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
