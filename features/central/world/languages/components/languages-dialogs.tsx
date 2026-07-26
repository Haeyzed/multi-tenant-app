"use client"

import * as React from "react"

import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { useDeleteLanguage } from "@/features/central/world/hooks/use-world-query"
import { LanguagesFormDialog } from "@/features/central/world/languages/components/languages-form-dialog"
import { useLanguages } from "@/features/central/world/languages/components/languages-provider"
import { LanguagesViewDialog } from "@/features/central/world/languages/components/languages-view-dialog"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function LanguagesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useLanguages()
  const deleteLanguage = useDeleteLanguage()

  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })

  const runDelete = () => {
    if (!currentRow) {
      return
    }

    deleteLanguage.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Language "${currentRow.name}" deleted successfully`
        )
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to delete language")
      },
    })
  }

  return (
    <>
      <LanguagesFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <LanguagesFormDialog
            key={`language-update-${currentRow.id}`}
            open={open === "update"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            currentRow={currentRow}
          />

          <LanguagesViewDialog
            key={`language-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            language={currentRow}
          />

          <ConfirmActionDialog
            open={open === "delete"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Delete language"
            description={
              <>
                Delete <strong>{currentRow.name}</strong>? This cannot be
                undone.
              </>
            }
            confirmLabel="Delete"
            variant="destructive"
            isPending={deleteLanguage.isPending}
            onConfirm={runDelete}
          />
        </>
      ) : null}
    </>
  )
}
