"use client"

import { PlansFormDialog } from "@/features/central/billing/plans/components/plans-form-dialog"
import { usePlans } from "@/features/central/billing/plans/components/plans-provider"
import { PlansViewDialog } from "@/features/central/billing/plans/components/plans-view-dialog"
import {
  useActivatePlan,
  useArchivePlan,
  useDeletePlan,
} from "@/features/central/billing/plans/hooks/use-plan-query"
import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function PlansDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePlans()
  const deletePlan = useDeletePlan()
  const activatePlan = useActivatePlan()
  const archivePlan = useArchivePlan()
  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })

  const runAction = (action: "delete" | "activate" | "archive") => {
    if (!currentRow) {
      return
    }

    const onSuccess = (message?: string, fallback?: string) => {
      toastApiSuccess(message, fallback)
      handleClose()
    }

    const onError = (error: unknown) => {
      toastApiError(error, `Failed to ${action} plan`)
    }

    if (action === "delete") {
      deletePlan.mutate(currentRow.id, {
        onSuccess: (result) =>
          onSuccess(
            result.message,
            `Plan "${currentRow.name}" deleted successfully`
          ),
        onError,
      })
      return
    }

    if (action === "activate") {
      activatePlan.mutate(currentRow.id, {
        onSuccess: (result) =>
          onSuccess(
            result.message,
            `Plan "${currentRow.name}" activated successfully`
          ),
        onError,
      })
      return
    }

    archivePlan.mutate(currentRow.id, {
      onSuccess: (result) =>
        onSuccess(
          result.message,
          `Plan "${currentRow.name}" archived successfully`
        ),
      onError,
    })
  }

  const isPending =
    deletePlan.isPending || activatePlan.isPending || archivePlan.isPending

  return (
    <>
      <PlansFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <PlansFormDialog
            key={`plan-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <PlansViewDialog
            key={`plan-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            plan={currentRow}
          />

          <ConfirmActionDialog
            open={open === "delete"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Delete plan"
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
            title="Activate plan"
            description={
              <>
                Activate <strong>{currentRow.name}</strong> for new
                subscriptions.
              </>
            }
            confirmLabel="Activate"
            isPending={isPending}
            onConfirm={() => runAction("activate")}
          />

          <ConfirmActionDialog
            open={open === "archive"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Archive plan"
            description={
              <>
                Archive <strong>{currentRow.name}</strong> so it is no longer
                offered to new tenants.
              </>
            }
            confirmLabel="Archive"
            variant="destructive"
            isPending={isPending}
            onConfirm={() => runAction("archive")}
          />
        </>
      ) : null}
    </>
  )
}
