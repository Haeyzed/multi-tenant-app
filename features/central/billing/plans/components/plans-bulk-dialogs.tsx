"use client"

import { usePlans } from "@/features/central/billing/plans/components/plans-provider"
import {
  useActivateManyPlans,
  useArchiveManyPlans,
  useDeleteManyPlans,
} from "@/features/central/billing/plans/hooks/use-plan-query"
import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { ConfirmTypedDeleteDialog } from "@/features/central/shared/components/confirm-typed-delete-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function PlansBulkDialogs() {
  const { open, setOpen, bulkSelection, setBulkSelection } = usePlans()
  const deleteMany = useDeleteManyPlans()
  const activateMany = useActivateManyPlans()
  const archiveMany = useArchiveManyPlans()

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
        title={`Delete ${count} ${count === 1 ? "plan" : "plans"}`}
        description="Soft-delete the selected plans. They can be restored later from the API."
        warning="This removes the selected plans from the active catalog."
        isPending={deleteMany.isPending}
        confirmDisabled={count === 0}
        onConfirm={() => {
          deleteMany.mutate(ids, {
            onSuccess: (result) =>
              finishSuccess(
                result.message,
                `Deleted ${count} ${count === 1 ? "plan" : "plans"}`
              ),
            onError: (error) => toastApiError(error, "Failed to delete plans"),
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
        title={`Activate ${count} ${count === 1 ? "plan" : "plans"}`}
        description="Make the selected plans available for new subscriptions."
        confirmLabel="Activate"
        isPending={activateMany.isPending}
        confirmDisabled={count === 0}
        onConfirm={() => {
          activateMany.mutate(ids, {
            onSuccess: (result) =>
              finishSuccess(
                result.message,
                `Activated ${count} ${count === 1 ? "plan" : "plans"}`
              ),
            onError: (error) =>
              toastApiError(error, "Failed to activate plans"),
          })
        }}
      />

      <ConfirmActionDialog
        open={open === "archiveMany"}
        onOpenChange={(val) => {
          if (!val) {
            handleClose()
          }
        }}
        title={`Archive ${count} ${count === 1 ? "plan" : "plans"}`}
        description="Archive the selected plans so they are no longer offered to new tenants."
        confirmLabel="Archive"
        variant="destructive"
        isPending={archiveMany.isPending}
        confirmDisabled={count === 0}
        onConfirm={() => {
          archiveMany.mutate(ids, {
            onSuccess: (result) =>
              finishSuccess(
                result.message,
                `Archived ${count} ${count === 1 ? "plan" : "plans"}`
              ),
            onError: (error) =>
              toastApiError(error, "Failed to archive plans"),
          })
        }}
      />
    </>
  )
}
