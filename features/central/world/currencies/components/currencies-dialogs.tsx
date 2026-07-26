"use client"

import * as React from "react"

import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { CurrenciesFormDialog } from "@/features/central/world/currencies/components/currencies-form-dialog"
import { useCurrencies } from "@/features/central/world/currencies/components/currencies-provider"
import { CurrenciesViewDialog } from "@/features/central/world/currencies/components/currencies-view-dialog"
import { useDeleteCurrency } from "@/features/central/world/hooks/use-world-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function CurrenciesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCurrencies()
  const deleteCurrency = useDeleteCurrency()

  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })

  const runDelete = () => {
    if (!currentRow) {
      return
    }

    deleteCurrency.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Currency "${currentRow.code}" deleted successfully`
        )
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to delete currency")
      },
    })
  }

  return (
    <>
      <CurrenciesFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <CurrenciesFormDialog
            key={`currency-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <CurrenciesViewDialog
            key={`currency-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currency={currentRow}
          />

          <ConfirmActionDialog
            open={open === "delete"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Delete currency"
            description={
              <>
                Delete <strong>{currentRow.name}</strong> ({currentRow.code})?
                Countries referencing it may be affected.
              </>
            }
            confirmLabel="Delete"
            variant="destructive"
            isPending={deleteCurrency.isPending}
            onConfirm={runDelete}
          />
        </>
      ) : null}
    </>
  )
}
