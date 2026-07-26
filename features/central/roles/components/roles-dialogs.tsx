"use client"

import { Alert, AlertDescription } from "@/components/reui/alert"
import { RolesAssignPermissionsDialog } from "@/features/central/roles/components/roles-assign-permissions-dialog"
import { RolesFormDialog } from "@/features/central/roles/components/roles-form-dialog"
import { useRoles } from "@/features/central/roles/components/roles-provider"
import { RolesViewDialog } from "@/features/central/roles/components/roles-view-dialog"
import { useDeleteRole } from "@/features/central/roles/hooks/use-role-query"
import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function RolesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRoles()
  const deleteRole = useDeleteRole()
  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })
  const isProtected = currentRow?.name === "super-admin"

  const runDelete = () => {
    if (!currentRow || isProtected) {
      return
    }

    deleteRole.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Role "${currentRow.name}" deleted successfully`
        )
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to delete role")
      },
    })
  }

  return (
    <>
      <RolesFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <RolesFormDialog
            key={`role-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <RolesViewDialog
            key={`role-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            role={currentRow}
          />

          <RolesAssignPermissionsDialog
            key={`role-assign-permissions-${currentRow.id}`}
            open={open === "assignPermissions"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            role={currentRow}
          />

          <ConfirmActionDialog
            open={open === "delete"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Delete role"
            description={
              <>
                Delete <strong>{currentRow.name}</strong>? Users assigned to this
                role will lose it.
              </>
            }
            confirmLabel="Delete"
            variant="destructive"
            isPending={deleteRole.isPending}
            confirmDisabled={isProtected}
            onConfirm={runDelete}
          >
            {isProtected ? (
              <Alert variant="warning">
                <AlertDescription>
                  The super-admin role is protected and cannot be deleted.
                </AlertDescription>
              </Alert>
            ) : null}
          </ConfirmActionDialog>
        </>
      ) : null}
    </>
  )
}
