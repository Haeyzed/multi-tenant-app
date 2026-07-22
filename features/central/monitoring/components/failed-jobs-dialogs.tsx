"use client"

import * as React from "react"
import {AlertTriangle} from "lucide-react"

import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {Button} from "@/components/ui/button"
import {ScrollArea} from "@/components/ui/scroll-area"
import {
    ResponsiveDialog,
    ResponsiveDialogClose,
    ResponsiveDialogContent,
    ResponsiveDialogDescription,
    ResponsiveDialogFooter,
    ResponsiveDialogHeader,
    ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import {Spinner} from "@/components/ui/spinner"
import {Textarea} from "@/components/ui/textarea"
import {useMonitoring} from "@/features/central/monitoring/components/monitoring-provider"
import {useFlushFailedJobs, useRetryFailedJob,} from "@/features/central/monitoring/hooks/use-monitoring-query"
import {toastApiError, toastApiSuccess} from "@/lib/toast-api"

export function FailedJobsDialogs() {
    const {open, setOpen, currentRow, setCurrentRow} = useMonitoring()
    const retryFailedJob = useRetryFailedJob()
    const flushFailedJobs = useFlushFailedJobs()

    const handleClose = React.useCallback(() => {
        setOpen(null)
        setTimeout(() => {
            setCurrentRow(null)
        }, 300)
    }, [setOpen, setCurrentRow])

    return (
        <>
            {currentRow ? (
                <>
                    <ResponsiveDialog
                        open={open === "viewException"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                    >
                        <ResponsiveDialogContent className="sm:max-w-3xl">
                            <ResponsiveDialogHeader>
                                <ResponsiveDialogTitle>
                                    Failed job exception
                                </ResponsiveDialogTitle>
                                <ResponsiveDialogDescription>
                                    Exception snippet for failed job #{currentRow.id}.
                                </ResponsiveDialogDescription>
                            </ResponsiveDialogHeader>
                            <ScrollArea className="h-96 rounded-md border">
                                <Textarea
                                    readOnly
                                    value={currentRow.exception || "No exception available."}
                                    className="min-h-96 resize-none border-0 font-mono text-xs focus-visible:ring-0"
                                />
                            </ScrollArea>
                            <ResponsiveDialogFooter>
                                <ResponsiveDialogClose
                                    render={<Button variant="outline">Close</Button>}
                                />
                            </ResponsiveDialogFooter>
                        </ResponsiveDialogContent>
                    </ResponsiveDialog>

                    <ResponsiveDialog
                        open={open === "retry"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                    >
                        <ResponsiveDialogContent className="sm:max-w-md">
                            <ResponsiveDialogHeader>
                                <ResponsiveDialogTitle>Retry failed job</ResponsiveDialogTitle>
                                <ResponsiveDialogDescription>
                                    Queue retry for failed job #{currentRow.id}. The backend will
                                    remove this failed job row after accepting the retry action.
                                </ResponsiveDialogDescription>
                            </ResponsiveDialogHeader>
                            <ResponsiveDialogFooter>
                                <ResponsiveDialogClose
                                    render={<Button variant="outline">Cancel</Button>}
                                />
                                <Button
                                    disabled={retryFailedJob.isPending}
                                    onClick={() => {
                                        retryFailedJob.mutate(currentRow.id, {
                                            onSuccess: (result) => {
                                                toastApiSuccess(result.message, "Failed job retried")
                                                handleClose()
                                            },
                                            onError: (error) =>
                                                toastApiError(error, "Failed to retry job"),
                                        })
                                    }}
                                >
                                    {retryFailedJob.isPending ? <Spinner/> : null}
                                    Retry
                                </Button>
                            </ResponsiveDialogFooter>
                        </ResponsiveDialogContent>
                    </ResponsiveDialog>
                </>
            ) : null}

            <ResponsiveDialog
                open={open === "flush"}
                onOpenChange={(val) => {
                    if (!val) {
                        handleClose()
                    }
                }}
            >
                <ResponsiveDialogContent className="sm:max-w-md">
                    <ResponsiveDialogHeader>
                        <ResponsiveDialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="size-5"/>
                            Flush failed jobs
                        </ResponsiveDialogTitle>
                        <ResponsiveDialogDescription>
                            Permanently remove all failed job records.
                        </ResponsiveDialogDescription>
                    </ResponsiveDialogHeader>
                    <Alert variant="destructive">
                        <AlertTitle>Warning</AlertTitle>
                        <AlertDescription>
                            This clears the failed jobs table. Export or inspect exceptions
                            before continuing if you still need them.
                        </AlertDescription>
                    </Alert>
                    <ResponsiveDialogFooter>
                        <ResponsiveDialogClose
                            render={<Button variant="outline">Cancel</Button>}
                        />
                        <Button
                            variant="destructive"
                            disabled={flushFailedJobs.isPending}
                            onClick={() => {
                                flushFailedJobs.mutate(undefined, {
                                    onSuccess: (result) => {
                                        toastApiSuccess(
                                            result.message,
                                            `Flushed ${result.data.deleted} failed jobs`
                                        )
                                        handleClose()
                                    },
                                    onError: (error) =>
                                        toastApiError(error, "Failed to flush jobs"),
                                })
                            }}
                        >
                            {flushFailedJobs.isPending ? <Spinner/> : null}
                            Flush
                        </Button>
                    </ResponsiveDialogFooter>
                </ResponsiveDialogContent>
            </ResponsiveDialog>
        </>
    )
}
