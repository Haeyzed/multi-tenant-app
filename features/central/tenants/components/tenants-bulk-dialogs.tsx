"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { ConfirmTypedDeleteDialog } from "@/features/central/shared/components/confirm-typed-delete-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { useTenants } from "@/features/central/tenants/components/tenants-provider"
import {
  useActivateManyTenants,
  useDeleteManyTenants,
  useSuspendManyTenants,
} from "@/features/central/tenants/hooks/use-tenant-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function TenantsBulkDialogs() {
  const { open, setOpen, bulkSelection, setBulkSelection } = useTenants()
  const deleteMany = useDeleteManyTenants()
  const suspendMany = useSuspendManyTenants()
  const activateMany = useActivateManyTenants()
  const [suspendReason, setSuspendReason] = React.useState("")

  const ids = bulkSelection?.ids ?? []
  const count = ids.length

  const handleClose = useEntityDialogClose({
    setOpen,
    onAfterClose: () => {
      setBulkSelection(null)
      setSuspendReason("")
    },
  })

  React.useEffect(() => {
    if (open === "suspendMany") {
      setSuspendReason("")
    }
  }, [open])

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
        title={`Delete ${count} ${count === 1 ? "tenant" : "tenants"}`}
        description="Soft-delete the selected tenants. They can be restored later from the API."
        warning="This removes the selected tenants from the active list."
        isPending={deleteMany.isPending}
        confirmDisabled={count === 0}
        onConfirm={() => {
          deleteMany.mutate(ids, {
            onSuccess: (result) =>
              finishSuccess(
                result.message,
                `Deleted ${count} ${count === 1 ? "tenant" : "tenants"} successfully`
              ),
            onError: (error) =>
              toastApiError(error, "Failed to delete tenants"),
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
        title={`Suspend ${count} ${count === 1 ? "tenant" : "tenants"}`}
        description="Block platform access for the selected tenants."
        confirmLabel="Suspend"
        variant="destructive"
        isPending={suspendMany.isPending}
        confirmDisabled={count === 0}
        onConfirm={() => {
          suspendMany.mutate(
            { ids, reason: suspendReason || undefined },
            {
              onSuccess: (result) =>
                finishSuccess(
                  result.message,
                  `Suspended ${count} ${count === 1 ? "tenant" : "tenants"} successfully`
                ),
              onError: (error) =>
                toastApiError(error, "Failed to suspend tenants"),
            }
          )
        }}
      >
        <div className="space-y-2">
          <Input
            placeholder="Reason (optional)"
            value={suspendReason}
            onChange={(event) => setSuspendReason(event.target.value)}
          />
        </div>
      </ConfirmActionDialog>

      <ConfirmActionDialog
        open={open === "activateMany"}
        onOpenChange={(val) => {
          if (!val) {
            handleClose()
          }
        }}
        title={`Activate ${count} ${count === 1 ? "tenant" : "tenants"}`}
        description="Restore platform access for the selected tenants."
        confirmLabel="Activate"
        isPending={activateMany.isPending}
        confirmDisabled={count === 0}
        onConfirm={() => {
          activateMany.mutate(ids, {
            onSuccess: (result) =>
              finishSuccess(
                result.message,
                `Activated ${count} ${count === 1 ? "tenant" : "tenants"} successfully`
              ),
            onError: (error) =>
              toastApiError(error, "Failed to activate tenants"),
          })
        }}
      />
    </>
  )
}
