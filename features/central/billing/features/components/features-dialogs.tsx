"use client"

import * as React from "react"

import { useFeatures } from "@/features/central/billing/features/components/features-provider"
import { FeaturesFormDialog } from "@/features/central/billing/features/components/features-form-dialog"
import { FeaturesViewDialog } from "@/features/central/billing/features/components/features-view-dialog"
import { useDeleteFeature } from "@/features/central/billing/features/hooks/use-feature-query"
import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function FeaturesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useFeatures()
  const deleteFeature = useDeleteFeature()

  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })

  const runDelete = () => {
    if (!currentRow) {
      return
    }

    deleteFeature.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Feature "${currentRow.name}" deleted successfully`
        )
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to delete feature")
      },
    })
  }

  return (
    <>
      <FeaturesFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <FeaturesFormDialog
            key={`feature-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <FeaturesViewDialog
            key={`feature-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            feature={currentRow}
          />

          <ConfirmActionDialog
            open={open === "delete"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Delete feature"
            description={
              <>
                Soft-delete <strong>{currentRow.name}</strong>? This can be
                restored later from the API.
              </>
            }
            confirmLabel="Delete"
            variant="destructive"
            isPending={deleteFeature.isPending}
            onConfirm={runDelete}
          />
        </>
      ) : null}
    </>
  )
}
