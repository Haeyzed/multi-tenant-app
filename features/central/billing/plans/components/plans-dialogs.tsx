"use client"

import * as React from "react"

import {Button} from "@/components/ui/button"
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
import {PlansFormDialog} from "@/features/central/billing/plans/components/plans-form-dialog"
import {usePlans} from "@/features/central/billing/plans/components/plans-provider"
import {PlansViewDialog} from "@/features/central/billing/plans/components/plans-view-dialog"
import {useActivatePlan, useArchivePlan, useDeletePlan,} from "@/features/central/billing/plans/hooks/use-plan-query"
import {toastApiError, toastApiSuccess} from "@/lib/toast-api"

export function PlansDialogs() {
    const {open, setOpen, currentRow, setCurrentRow} = usePlans()
    const deletePlan = useDeletePlan()
    const activatePlan = useActivatePlan()
    const archivePlan = useArchivePlan()
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleClose = React.useCallback(() => {
        setOpen(null)
        setTimeout(() => {
            setCurrentRow(null)
        }, 300)
    }, [setOpen, setCurrentRow])

    const runAction = (action: "delete" | "activate" | "archive") => {
        if (!currentRow) {
            return
        }

        setIsSubmitting(true)

        const onSuccess = (message?: string, fallback?: string) => {
            toastApiSuccess(message, fallback)
            setIsSubmitting(false)
            handleClose()
        }

        const onError = (error: unknown) => {
            toastApiError(error, `Failed to ${action} plan`)
            setIsSubmitting(false)
        }

        if (action === "delete") {
            deletePlan.mutate(currentRow.id, {
                onSuccess: (result) =>
                    onSuccess(
                        result.message,
                        `Plan "${currentRow.name}" deleted successfully`
                    ),
                onError,
            })
            return
        }

        if (action === "activate") {
            activatePlan.mutate(currentRow.id, {
                onSuccess: (result) =>
                    onSuccess(
                        result.message,
                        `Plan "${currentRow.name}" activated successfully`
                    ),
                onError,
            })
            return
        }

        archivePlan.mutate(currentRow.id, {
            onSuccess: (result) =>
                onSuccess(
                    result.message,
                    `Plan "${currentRow.name}" archived successfully`
                ),
            onError,
        })
    }

    return (
        <>
            <PlansFormDialog
                open={open === "create"}
                onOpenChange={(val) => {
                    if (!val) {
                        setOpen(null)
                    }
                }}
            />

            {currentRow ? (
                <>
                    <PlansFormDialog
                        key={`plan-update-${currentRow.id}`}
                        open={open === "update"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                        currentRow={currentRow}
                    />

                    <PlansViewDialog
                        key={`plan-view-${currentRow.id}`}
                        open={open === "view"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                        plan={currentRow}
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
                                <ResponsiveDialogTitle>Delete plan</ResponsiveDialogTitle>
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
                                    onClick={() => runAction("delete")}
                                >
                                    {isSubmitting ? <Spinner/> : null}
                                    Delete
                                </Button>
                            </ResponsiveDialogFooter>
                        </ResponsiveDialogContent>
                    </ResponsiveDialog>

                    <ResponsiveDialog
                        open={open === "activate"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                    >
                        <ResponsiveDialogContent className="sm:max-w-md">
                            <ResponsiveDialogHeader>
                                <ResponsiveDialogTitle>Activate plan</ResponsiveDialogTitle>
                                <ResponsiveDialogDescription>
                                    Activate <strong>{currentRow.name}</strong> for new
                                    subscriptions.
                                </ResponsiveDialogDescription>
                            </ResponsiveDialogHeader>
                            <ResponsiveDialogFooter>
                                <ResponsiveDialogClose
                                    render={<Button variant="outline">Cancel</Button>}
                                />
                                <Button
                                    disabled={isSubmitting}
                                    onClick={() => runAction("activate")}
                                >
                                    {isSubmitting ? <Spinner/> : null}
                                    Activate
                                </Button>
                            </ResponsiveDialogFooter>
                        </ResponsiveDialogContent>
                    </ResponsiveDialog>

                    <ResponsiveDialog
                        open={open === "archive"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                    >
                        <ResponsiveDialogContent className="sm:max-w-md">
                            <ResponsiveDialogHeader>
                                <ResponsiveDialogTitle>Archive plan</ResponsiveDialogTitle>
                                <ResponsiveDialogDescription>
                                    Archive <strong>{currentRow.name}</strong> so it is no longer
                                    offered to new tenants.
                                </ResponsiveDialogDescription>
                            </ResponsiveDialogHeader>
                            <ResponsiveDialogFooter>
                                <ResponsiveDialogClose
                                    render={<Button variant="outline">Cancel</Button>}
                                />
                                <Button
                                    variant="destructive"
                                    disabled={isSubmitting}
                                    onClick={() => runAction("archive")}
                                >
                                    {isSubmitting ? <Spinner/> : null}
                                    Archive
                                </Button>
                            </ResponsiveDialogFooter>
                        </ResponsiveDialogContent>
                    </ResponsiveDialog>
                </>
            ) : null}
        </>
    )
}
