"use client"

import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { ConfirmTypedDeleteDialog } from "@/features/central/shared/components/confirm-typed-delete-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { useUsers } from "@/features/central/users/components/users-provider"
import {
  useActivateManyUsers,
  useDeleteManyUsers,
  useSuspendManyUsers,
} from "@/features/central/users/hooks/use-user-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function UsersBulkDialogs() {
  const { open, setOpen, bulkSelection, setBulkSelection } = useUsers()
  const deleteMany = useDeleteManyUsers()
  const suspendMany = useSuspendManyUsers()
  const activateMany = useActivateManyUsers()

  const ids = bulkSelection?.ids ?? []
  const count = ids.length

  const handleClose = useEntityDialogClose({
    setOpen,
    onAfterClose: () => setBulkSelection(null),
  })

  const finishSuccess = (message?: string, fallback?: string) => {
    toastApiSuccess(message, fallback)
    bulkSelection?.onComplete?.()
    handleClose()
  }

  return (
    <>
      <ConfirmTypedDeleteDialog
        open={open === "deleteMany"}
        onOpenChange={(val) => {
          if (!val) {
            handleClose()
          }
        }}
        title={`Delete ${count} ${count === 1 ? "user" : "users"}`}
        description="Soft-delete the selected users. They can be restored later from the API."
        warning="This removes the selected users from the active list and revokes their sessions."
        isPending={deleteMany.isPending}
        confirmDisabled={count === 0}
        onConfirm={() => {
          deleteMany.mutate(ids, {
            onSuccess: (result) =>
              finishSuccess(
                result.message,
                `Deleted ${count} ${count === 1 ? "user" : "users"} successfully`
              ),
            onError: (error) => toastApiError(error, "Failed to delete users"),
          })
        }}
      />

      <ConfirmActionDialog
        open={open === "suspendMany"}
        onOpenChange={(val) => {
          if (!val) {
            handleClose()
          }
        }}
        title={`Suspend ${count} ${count === 1 ? "user" : "users"}`}
        description="Block platform access and revoke sessions for the selected users."
        confirmLabel="Suspend"
        variant="destructive"
        isPending={suspendMany.isPending}
        confirmDisabled={count === 0}
        onConfirm={() => {
          suspendMany.mutate(ids, {
            onSuccess: (result) =>
              finishSuccess(
                result.message,
                `Suspended ${count} ${count === 1 ? "user" : "users"} successfully`
              ),
            onError: (error) =>
              toastApiError(error, "Failed to suspend users"),
          })
        }}
      />

      <ConfirmActionDialog
        open={open === "activateMany"}
        onOpenChange={(val) => {
          if (!val) {
            handleClose()
          }
        }}
        title={`Activate ${count} ${count === 1 ? "user" : "users"}`}
        description="Restore platform access for the selected users."
        confirmLabel="Activate"
        isPending={activateMany.isPending}
        confirmDisabled={count === 0}
        onConfirm={() => {
          activateMany.mutate(ids, {
            onSuccess: (result) =>
              finishSuccess(
                result.message,
                `Activated ${count} ${count === 1 ? "user" : "users"} successfully`
              ),
            onError: (error) =>
              toastApiError(error, "Failed to activate users"),
          })
        }}
      />
    </>
  )
}
