"use client"

import { PermissionsFormDialog } from "@/features/central/permissions/components/permissions-form-dialog"
import { usePermissions } from "@/features/central/permissions/components/permissions-provider"
import { PermissionsViewDialog } from "@/features/central/permissions/components/permissions-view-dialog"
import { useDeletePermission } from "@/features/central/permissions/hooks/use-permission-query"
import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function PermissionsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePermissions()
  const deletePermission = useDeletePermission()
  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })

  const runDelete = () => {
    if (!currentRow) {
      return
    }

    deletePermission.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Permission "${currentRow.name}" deleted successfully`
        )
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to delete permission")
      },
    })
  }

  return (
    <>
      <PermissionsFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <PermissionsFormDialog
            key={`permission-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <PermissionsViewDialog
            key={`permission-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            permission={currentRow}
          />

          <ConfirmActionDialog
            open={open === "delete"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Delete permission"
            description={
              <>
                Delete <strong>{currentRow.name}</strong>? Roles and users that
                reference it will lose this permission.
              </>
            }
            confirmLabel="Delete"
            variant="destructive"
            isPending={deletePermission.isPending}
            onConfirm={runDelete}
          />
        </>
      ) : null}
    </>
  )
}
