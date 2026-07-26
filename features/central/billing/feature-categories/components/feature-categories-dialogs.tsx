"use client"

import {
  FeatureCategoriesFormDialog
} from "@/features/central/billing/feature-categories/components/feature-categories-form-dialog"
import {
  useFeatureCategories
} from "@/features/central/billing/feature-categories/components/feature-categories-provider"
import {
  FeatureCategoriesViewDialog
} from "@/features/central/billing/feature-categories/components/feature-categories-view-dialog"
import { useDeleteFeatureCategory } from "@/features/central/billing/feature-categories/hooks/use-feature-category-query"
import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function FeatureCategoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useFeatureCategories()
  const deleteFeatureCategory = useDeleteFeatureCategory()
  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })

  const runDelete = () => {
    if (!currentRow) {
      return
    }

    deleteFeatureCategory.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Feature category "${currentRow.name}" deleted successfully`
        )
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to delete feature category")
      },
    })
  }

  return (
    <>
      <FeatureCategoriesFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <FeatureCategoriesFormDialog
            key={`feature-category-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <FeatureCategoriesViewDialog
            key={`feature-category-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            category={currentRow}
          />

          <ConfirmActionDialog
            open={open === "delete"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Delete feature category"
            description={
              <>
                Delete <strong>{currentRow.name}</strong>? Categories with
                assigned features cannot be deleted.
              </>
            }
            confirmLabel="Delete"
            variant="destructive"
            isPending={deleteFeatureCategory.isPending}
            onConfirm={runDelete}
          />
        </>
      ) : null}
    </>
  )
}
