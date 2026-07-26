"use client"

import { usePermissions } from "@/features/central/permissions/components/permissions-provider"
import { useDeleteManyPermissions } from "@/features/central/permissions/hooks/use-permission-query"
import { ConfirmTypedDeleteDialog } from "@/features/central/shared/components/confirm-typed-delete-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function PermissionsBulkDialogs() {
  const { open, setOpen, bulkSelection, setBulkSelection } = usePermissions()
  const deleteMany = useDeleteManyPermissions()

  const ids = bulkSelection?.ids ?? []
  const count = ids.length

  const handleClose = useEntityDialogClose({
    setOpen,
    onAfterClose: () => setBulkSelection(null),
  })

  return (
    <ConfirmTypedDeleteDialog
      open={open === "deleteMany"}
      onOpenChange={(val) => {
        if (!val) {
          handleClose()
        }
      }}
      title={`Delete ${count} ${count === 1 ? "permission" : "permissions"}`}
      description="Permanently delete the selected permissions from the catalog."
      warning="Roles and users that reference these permissions will lose them."
      isPending={deleteMany.isPending}
      confirmDisabled={count === 0}
      onConfirm={() => {
        deleteMany.mutate(ids, {
          onSuccess: (result) => {
            toastApiSuccess(
              result.message,
              `Deleted ${count} ${count === 1 ? "permission" : "permissions"}`
            )
            bulkSelection?.onComplete?.()
            handleClose()
          },
          onError: (error) =>
            toastApiError(error, "Failed to delete permissions"),
        })
      }}
    />
  )
}
