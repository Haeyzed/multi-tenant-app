"use client"

import * as React from "react"

import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { CountriesFormDialog } from "@/features/central/world/countries/components/countries-form-dialog"
import { useCountries } from "@/features/central/world/countries/components/countries-provider"
import { CountriesViewDialog } from "@/features/central/world/countries/components/countries-view-dialog"
import { useDeleteCountry } from "@/features/central/world/hooks/use-world-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function CountriesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCountries()
  const deleteCountry = useDeleteCountry()

  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })

  const runDelete = () => {
    if (!currentRow) {
      return
    }

    deleteCountry.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Country "${currentRow.name}" deleted successfully`
        )
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to delete country")
      },
    })
  }

  return (
    <>
      <CountriesFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <CountriesFormDialog
            key={`country-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <CountriesViewDialog
            key={`country-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            country={currentRow}
          />

          <ConfirmActionDialog
            open={open === "delete"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Delete country"
            description={
              <>
                Delete <strong>{currentRow.name}</strong>? Related states,
                cities, and lookups may be affected.
              </>
            }
            confirmLabel="Delete"
            variant="destructive"
            isPending={deleteCountry.isPending}
            onConfirm={runDelete}
          />
        </>
      ) : null}
    </>
  )
}
