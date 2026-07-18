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
import { useFeatures } from "@/features/central/billing/features/components/features-provider"
import { FeaturesFormDialog } from "@/features/central/billing/features/components/features-form-dialog"
import { FeaturesViewDialog } from "@/features/central/billing/features/components/features-view-dialog"
import { useDeleteFeature } from "@/features/central/billing/features/hooks/use-feature-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function FeaturesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useFeatures()
  const deleteFeature = useDeleteFeature()
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

    deleteFeature.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Feature "${currentRow.name}" deleted successfully`
        )
        setIsSubmitting(false)
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to delete feature")
        setIsSubmitting(false)
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
                <ResponsiveDialogTitle>Delete feature</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Soft-delete <strong>{currentRow.name}</strong>? This can be
                  restored later from the API.
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
