"use client"

import * as React from "react"

import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { useDeleteTimezone } from "@/features/central/world/hooks/use-world-query"
import { TimezonesFormDialog } from "@/features/central/world/timezones/components/timezones-form-dialog"
import { useTimezones } from "@/features/central/world/timezones/components/timezones-provider"
import { TimezonesViewDialog } from "@/features/central/world/timezones/components/timezones-view-dialog"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function TimezonesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTimezones()
  const deleteTimezone = useDeleteTimezone()

  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })

  const runDelete = () => {
    if (!currentRow) {
      return
    }

    deleteTimezone.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Timezone "${currentRow.name}" deleted successfully`
        )
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to delete timezone")
      },
    })
  }

  return (
    <>
      <TimezonesFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <TimezonesFormDialog
            key={`timezone-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <TimezonesViewDialog
            key={`timezone-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            timezone={currentRow}
          />

          <ConfirmActionDialog
            open={open === "delete"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Delete timezone"
            description={
              <>
                Delete <strong>{currentRow.name}</strong>? This cannot be
                undone.
              </>
            }
            confirmLabel="Delete"
            variant="destructive"
            isPending={deleteTimezone.isPending}
            onConfirm={runDelete}
          />
        </>
      ) : null}
    </>
  )
}
