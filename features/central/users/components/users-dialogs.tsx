"use client"

import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { UsersActivitiesDialog } from "@/features/central/users/components/users-activities-dialog"
import { UsersAssignPermissionsDialog } from "@/features/central/users/components/users-assign-permissions-dialog"
import { UsersAssignRolesDialog } from "@/features/central/users/components/users-assign-roles-dialog"
import { UsersFormDialog } from "@/features/central/users/components/users-form-dialog"
import { useUsers } from "@/features/central/users/components/users-provider"
import { UsersSecurityDialog } from "@/features/central/users/components/users-security-dialog"
import { UsersViewDialog } from "@/features/central/users/components/users-view-dialog"
import {
  useActivateUser,
  useDeleteUser,
  useSuspendUser,
} from "@/features/central/users/hooks/use-user-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()
  const deleteUser = useDeleteUser()
  const activateUser = useActivateUser()
  const suspendUser = useSuspendUser()
  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })

  const runAction = (action: "delete" | "activate" | "suspend") => {
    if (!currentRow) {
      return
    }

    const onSuccess = (message?: string) => {
      toastApiSuccess(
        message,
        `User "${currentRow.name}" ${action}d successfully`
      )
      handleClose()
    }

    const onError = (error: unknown) => {
      toastApiError(error, `Failed to ${action} user`)
    }

    if (action === "delete") {
      deleteUser.mutate(currentRow.id, {
        onSuccess: (result) => onSuccess(result.message),
        onError,
      })
      return
    }

    if (action === "activate") {
      activateUser.mutate(currentRow.id, {
        onSuccess: (result) => onSuccess(result.message),
        onError,
      })
      return
    }

    suspendUser.mutate(currentRow.id, {
      onSuccess: (result) => onSuccess(result.message),
      onError,
    })
  }

  const isPending =
    deleteUser.isPending || activateUser.isPending || suspendUser.isPending

  return (
    <>
      <UsersFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <UsersFormDialog
            key={`user-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <UsersViewDialog
            key={`user-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            user={currentRow}
          />

          <UsersAssignRolesDialog
            key={`user-assign-roles-${currentRow.id}`}
            open={open === "assignRoles"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            user={currentRow}
          />

          <UsersAssignPermissionsDialog
            key={`user-assign-permissions-${currentRow.id}`}
            open={open === "assignPermissions"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            user={currentRow}
          />

          <UsersSecurityDialog
            key={`user-security-${currentRow.id}`}
            open={open === "security"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            user={currentRow}
          />

          <UsersActivitiesDialog
            key={`user-activities-${currentRow.id}`}
            open={open === "activities"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            user={currentRow}
          />

          <ConfirmActionDialog
            open={open === "delete"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Delete user"
            description={
              <>
                Soft-delete <strong>{currentRow.name}</strong>? This can be
                restored later from the API.
              </>
            }
            confirmLabel="Delete"
            variant="destructive"
            isPending={isPending}
            onConfirm={() => runAction("delete")}
          />

          <ConfirmActionDialog
            open={open === "activate"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Activate user"
            description={
              <>
                Activate <strong>{currentRow.name}</strong> and restore
                platform access.
              </>
            }
            confirmLabel="Activate"
            isPending={isPending}
            onConfirm={() => runAction("activate")}
          />

          <ConfirmActionDialog
            open={open === "suspend"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Suspend user"
            description={
              <>
                Suspend <strong>{currentRow.name}</strong> and revoke active
                sessions.
              </>
            }
            confirmLabel="Suspend"
            variant="destructive"
            isPending={isPending}
            onConfirm={() => runAction("suspend")}
          />
        </>
      ) : null}
    </>
  )
}
