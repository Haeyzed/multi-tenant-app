"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Spinner } from "@/components/ui/spinner"
import { FeatureCategoriesFormDialog } from "@/features/central/billing/feature-categories/components/feature-categories-form-dialog"
import { useFeatureCategories } from "@/features/central/billing/feature-categories/components/feature-categories-provider"
import { FeatureCategoriesViewDialog } from "@/features/central/billing/feature-categories/components/feature-categories-view-dialog"
import { useDeleteFeatureCategory } from "@/features/central/billing/feature-categories/hooks/use-feature-category-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function FeatureCategoriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useFeatureCategories()
  const deleteFeatureCategory = useDeleteFeatureCategory()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleClose = React.useCallback(() => {
    setOpen(null)
    setTimeout(() => {
      setCurrentRow(null)
    }, 300)
  }, [setOpen, setCurrentRow])

  const runDelete = () => {
    if (!currentRow) {
      return
    }

    setIsSubmitting(true)

    deleteFeatureCategory.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Feature category "${currentRow.name}" deleted successfully`
        )
        setIsSubmitting(false)
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to delete feature category")
        setIsSubmitting(false)
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

          <ResponsiveDialog
            open={open === "delete"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
          >
            <ResponsiveDialogContent className="sm:max-w-md">
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>
                  Delete feature category
                </ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Delete <strong>{currentRow.name}</strong>? Categories with
                  assigned features cannot be deleted.
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button
                  variant="destructive"
                  disabled={isSubmitting}
                  onClick={runDelete}
                >
                  {isSubmitting ? <Spinner /> : null}
                  Delete
                </Button>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </>
      ) : null}
    </>
  )
}
