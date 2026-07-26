"use client"

import { useRoles } from "@/features/central/roles/components/roles-provider"
import { useDeleteManyRoles } from "@/features/central/roles/hooks/use-role-query"
import { ConfirmTypedDeleteDialog } from "@/features/central/shared/components/confirm-typed-delete-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function RolesBulkDialogs() {
  const { open, setOpen, bulkSelection, setBulkSelection } = useRoles()
  const deleteMany = useDeleteManyRoles()

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
      title={`Delete ${count} ${count === 1 ? "role" : "roles"}`}
      description="Delete the selected roles. Users assigned to them will lose those roles. The super-admin role is excluded from bulk delete."
      warning="This permanently removes the selected roles and their permission assignments."
      isPending={deleteMany.isPending}
      confirmDisabled={count === 0}
      onConfirm={() => {
        deleteMany.mutate(ids, {
          onSuccess: (result) => {
            toastApiSuccess(
              result.message,
              `Deleted ${count} ${count === 1 ? "role" : "roles"}`
            )
            bulkSelection?.onComplete?.()
            handleClose()
          },
          onError: (error) => toastApiError(error, "Failed to delete roles"),
        })
      }}
    />
  )
}
