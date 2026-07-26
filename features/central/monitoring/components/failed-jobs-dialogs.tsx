"use client"

import { AlertTriangle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FailedJobsExceptionDialog } from "@/features/central/monitoring/components/failed-jobs-exception-dialog"
import { useMonitoring } from "@/features/central/monitoring/components/monitoring-provider"
import {
  useFlushFailedJobs,
  useRetryFailedJob,
} from "@/features/central/monitoring/hooks/use-monitoring-query"
import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function FailedJobsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useMonitoring()
  const retryFailedJob = useRetryFailedJob()
  const flushFailedJobs = useFlushFailedJobs()
  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })

  const runAction = (action: "retry" | "flush") => {
    if (action === "retry") {
      if (!currentRow) {
        return
      }

      retryFailedJob.mutate(currentRow.id, {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Failed job retried successfully")
          handleClose()
        },
        onError: (error) => toastApiError(error, "Failed to retry job"),
      })
      return
    }

    flushFailedJobs.mutate(undefined, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          "Failed jobs flushed successfully"
        )
        handleClose()
      },
      onError: (error) => toastApiError(error, "Failed to flush jobs"),
    })
  }

  return (
    <>
      {currentRow ? (
        <>
          <FailedJobsExceptionDialog
            key={`failed-job-exception-${currentRow.id}`}
            open={open === "viewException"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            job={currentRow}
          />

          <ConfirmActionDialog
            open={open === "retry"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Retry failed job"
            description={`Queue retry for failed job #${currentRow.id}. The backend will remove this failed job row after accepting the retry action.`}
            confirmLabel="Retry"
            isPending={retryFailedJob.isPending}
            onConfirm={() => runAction("retry")}
          />
        </>
      ) : null}

      <ConfirmActionDialog
        open={open === "flush"}
        onOpenChange={(val) => {
          if (!val) {
            handleClose()
          }
        }}
        title={
          <span className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            Flush failed jobs
          </span>
        }
        description="Permanently remove all failed job records."
        confirmLabel="Flush"
        variant="destructive"
        isPending={flushFailedJobs.isPending}
        onConfirm={() => runAction("flush")}
      >
        <Alert variant="destructive">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            This clears the failed jobs table. Export or inspect exceptions
            before continuing if you still need them.
          </AlertDescription>
        </Alert>
      </ConfirmActionDialog>
    </>
  )
}
