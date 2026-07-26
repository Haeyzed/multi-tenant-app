"use client"

import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { TenantsFormDialog } from "@/features/central/tenants/components/tenants-form-dialog"
import { useTenants } from "@/features/central/tenants/components/tenants-provider"
import { TenantsSuspendDialog } from "@/features/central/tenants/components/tenants-suspend-dialog"
import { TenantsViewDialog } from "@/features/central/tenants/components/tenants-view-dialog"
import {
  useActivateTenant,
  useDeleteTenant,
} from "@/features/central/tenants/hooks/use-tenant-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function TenantsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTenants()
  const deleteTenant = useDeleteTenant()
  const activateTenant = useActivateTenant()
  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })

  const runDelete = () => {
    if (!currentRow) {
      return
    }

    deleteTenant.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Tenant "${currentRow.name}" deleted successfully`
        )
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to delete tenant")
      },
    })
  }

  const runActivate = () => {
    if (!currentRow) {
      return
    }

    activateTenant.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Tenant "${currentRow.name}" activated successfully`
        )
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to activate tenant")
      },
    })
  }

  return (
    <>
      <TenantsFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <TenantsFormDialog
            key={`tenant-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <TenantsViewDialog
            key={`tenant-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            tenant={currentRow}
          />

          <ConfirmActionDialog
            open={open === "delete"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Delete tenant"
            description={
              <>
                Soft-delete <strong>{currentRow.name}</strong>? This can be
                restored later from the API.
              </>
            }
            confirmLabel="Delete"
            variant="destructive"
            isPending={deleteTenant.isPending}
            onConfirm={runDelete}
          />

          <ConfirmActionDialog
            open={open === "activate"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Activate tenant"
            description={
              <>
                Activate <strong>{currentRow.name}</strong> and restore
                platform access.
              </>
            }
            confirmLabel="Activate"
            isPending={activateTenant.isPending}
            onConfirm={runActivate}
          />

          <TenantsSuspendDialog
            key={`tenant-suspend-${currentRow.id}`}
            open={open === "suspend"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            tenant={currentRow}
            onSuccess={handleClose}
          />
        </>
      ) : null}
    </>
  )
}
