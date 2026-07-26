"use client"

import * as React from "react"

import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { useDeleteState } from "@/features/central/world/hooks/use-world-query"
import { StatesFormDialog } from "@/features/central/world/states/components/states-form-dialog"
import { useStates } from "@/features/central/world/states/components/states-provider"
import { StatesViewDialog } from "@/features/central/world/states/components/states-view-dialog"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function StatesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStates()
  const deleteState = useDeleteState()

  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })

  const runDelete = () => {
    if (!currentRow) {
      return
    }

    deleteState.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `State "${currentRow.name}" deleted successfully`
        )
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to delete state")
      },
    })
  }

  return (
    <>
      <StatesFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <StatesFormDialog
            key={`state-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <StatesViewDialog
            key={`state-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            state={currentRow}
          />

          <ConfirmActionDialog
            open={open === "delete"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Delete state"
            description={
              <>
                Delete <strong>{currentRow.name}</strong>? Related cities may be
                affected.
              </>
            }
            confirmLabel="Delete"
            variant="destructive"
            isPending={deleteState.isPending}
            onConfirm={runDelete}
          />
        </>
      ) : null}
    </>
  )
}
