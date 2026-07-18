"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { usePlans } from "@/features/central/plans/components/plans-provider"
import {
  useActivateManyPlans,
  useArchiveManyPlans,
  useDeleteManyPlans,
} from "@/features/central/plans/hooks/use-plan-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

const CONFIRM_WORD = "DELETE"

export function PlansBulkDialogs() {
  const { open, setOpen, bulkSelection, setBulkSelection } = usePlans()
  const deleteMany = useDeleteManyPlans()
  const activateMany = useActivateManyPlans()
  const archiveMany = useArchiveManyPlans()
  const [confirmValue, setConfirmValue] = React.useState("")

  const ids = bulkSelection?.ids ?? []
  const count = ids.length

  const handleClose = React.useCallback(() => {
    setOpen(null)
    setConfirmValue("")
    setTimeout(() => {
      setBulkSelection(null)
    }, 300)
  }, [setOpen, setBulkSelection])

  const finishSuccess = (message?: string, fallback?: string) => {
    toastApiSuccess(message, fallback)
    bulkSelection?.onComplete?.()
    handleClose()
  }

  return (
    <>
      <ResponsiveDialog
        open={open === "deleteMany"}
        onOpenChange={(val) => {
          if (!val) {
            handleClose()
          }
        }}
      >
        <ResponsiveDialogContent className="sm:max-w-md">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="size-5" />
              Delete {count} {count === 1 ? "plan" : "plans"}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Soft-delete the selected plans. They can be restored later from
              the API.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>

          <div className="space-y-4 py-2">
            <Label className="flex flex-col items-start gap-1.5">
              <span>Confirm by typing &quot;{CONFIRM_WORD}&quot;:</span>
              <Input
                value={confirmValue}
                onChange={(event) => setConfirmValue(event.target.value)}
                placeholder={`Type "${CONFIRM_WORD}" to confirm.`}
                autoFocus
              />
            </Label>

            <Alert variant="destructive">
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This removes the selected plans from the active catalog.
              </AlertDescription>
            </Alert>
          </div>

          <ResponsiveDialogFooter>
            <ResponsiveDialogClose
              render={<Button variant="outline">Cancel</Button>}
            />
            <Button
              variant="destructive"
              disabled={
                confirmValue.trim() !== CONFIRM_WORD || deleteMany.isPending
              }
              onClick={() => {
                deleteMany.mutate(ids, {
                  onSuccess: (result) =>
                    finishSuccess(
                      result.message,
                      `Deleted ${count} ${count === 1 ? "plan" : "plans"}`
                    ),
                  onError: (error) =>
                    toastApiError(error, "Failed to delete plans"),
                })
              }}
            >
              {deleteMany.isPending ? <Spinner /> : null}
              Delete
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={open === "activateMany"}
        onOpenChange={(val) => {
          if (!val) {
            handleClose()
          }
        }}
      >
        <ResponsiveDialogContent className="sm:max-w-md">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              Activate {count} {count === 1 ? "plan" : "plans"}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Make the selected plans available for new subscriptions.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose
              render={<Button variant="outline">Cancel</Button>}
            />
            <Button
              disabled={activateMany.isPending || count === 0}
              onClick={() => {
                activateMany.mutate(ids, {
                  onSuccess: (result) =>
                    finishSuccess(
                      result.message,
                      `Activated ${count} ${count === 1 ? "plan" : "plans"}`
                    ),
                  onError: (error) =>
                    toastApiError(error, "Failed to activate plans"),
                })
              }}
            >
              {activateMany.isPending ? <Spinner /> : null}
              Activate
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>

      <ResponsiveDialog
        open={open === "archiveMany"}
        onOpenChange={(val) => {
          if (!val) {
            handleClose()
          }
        }}
      >
        <ResponsiveDialogContent className="sm:max-w-md">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>
              Archive {count} {count === 1 ? "plan" : "plans"}
            </ResponsiveDialogTitle>
            <ResponsiveDialogDescription>
              Archive the selected plans so they are no longer offered to new
              tenants.
            </ResponsiveDialogDescription>
          </ResponsiveDialogHeader>
          <ResponsiveDialogFooter>
            <ResponsiveDialogClose
              render={<Button variant="outline">Cancel</Button>}
            />
            <Button
              variant="destructive"
              disabled={archiveMany.isPending || count === 0}
              onClick={() => {
                archiveMany.mutate(ids, {
                  onSuccess: (result) =>
                    finishSuccess(
                      result.message,
                      `Archived ${count} ${count === 1 ? "plan" : "plans"}`
                    ),
                  onError: (error) =>
                    toastApiError(error, "Failed to archive plans"),
                })
              }}
            >
              {archiveMany.isPending ? <Spinner /> : null}
              Archive
            </Button>
          </ResponsiveDialogFooter>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </>
  )
}
