"use client"

import * as React from "react"

import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { CitiesFormDialog } from "@/features/central/world/cities/components/cities-form-dialog"
import { useCities } from "@/features/central/world/cities/components/cities-provider"
import { CitiesViewDialog } from "@/features/central/world/cities/components/cities-view-dialog"
import { useDeleteCity } from "@/features/central/world/hooks/use-world-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function CitiesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCities()
  const deleteCity = useDeleteCity()

  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })

  const runDelete = () => {
    if (!currentRow) {
      return
    }

    deleteCity.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `City "${currentRow.name}" deleted successfully`
        )
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to delete city")
      },
    })
  }

  return (
    <>
      <CitiesFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <CitiesFormDialog
            key={`city-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <CitiesViewDialog
            key={`city-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            city={currentRow}
          />

          <ConfirmActionDialog
            open={open === "delete"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Delete city"
            description={
              <>
                Delete <strong>{currentRow.name}</strong>? This cannot be
                undone.
              </>
            }
            confirmLabel="Delete"
            variant="destructive"
            isPending={deleteCity.isPending}
            onConfirm={runDelete}
          />
        </>
      ) : null}
    </>
  )
}
