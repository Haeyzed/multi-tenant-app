"use client"

import * as React from "react"
import {AlertTriangle} from "lucide-react"

import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
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
import {useTenants} from "@/features/central/tenants/components/tenants-provider"
import {
    useActivateManyTenants,
    useDeleteManyTenants,
    useSuspendManyTenants,
} from "@/features/central/tenants/hooks/use-tenant-query"
import {toastApiError, toastApiSuccess} from "@/lib/toast-api"

const CONFIRM_WORD = "DELETE"

export function TenantsBulkDialogs() {
    const {open, setOpen, bulkSelection, setBulkSelection} = useTenants()
    const deleteMany = useDeleteManyTenants()
    const suspendMany = useSuspendManyTenants()
    const activateMany = useActivateManyTenants()
    const [confirmValue, setConfirmValue] = React.useState("")
    const [suspendReason, setSuspendReason] = React.useState("")

    const ids = bulkSelection?.ids ?? []
    const count = ids.length

    const handleClose = React.useCallback(() => {
        setOpen(null)
        setConfirmValue("")
        setSuspendReason("")
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
                            <AlertTriangle className="size-5"/>
                            Delete {count} {count === 1 ? "tenant" : "tenants"}
                        </ResponsiveDialogTitle>
                        <ResponsiveDialogDescription>
                            Soft-delete the selected tenants. They can be restored later from
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
                                This removes the selected tenants from the active list.
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
                                            `Deleted ${count} ${count === 1 ? "tenant" : "tenants"}`
                                        ),
                                    onError: (error) =>
                                        toastApiError(error, "Failed to delete tenants"),
                                })
                            }}
                        >
                            {deleteMany.isPending ? <Spinner/> : null}
                            Delete
                        </Button>
                    </ResponsiveDialogFooter>
                </ResponsiveDialogContent>
            </ResponsiveDialog>

            <ResponsiveDialog
                open={open === "suspendMany"}
                onOpenChange={(val) => {
                    if (!val) {
                        handleClose()
                    }
                }}
            >
                <ResponsiveDialogContent className="sm:max-w-md">
                    <ResponsiveDialogHeader>
                        <ResponsiveDialogTitle>
                            Suspend {count} {count === 1 ? "tenant" : "tenants"}
                        </ResponsiveDialogTitle>
                        <ResponsiveDialogDescription>
                            Block platform access for the selected tenants.
                        </ResponsiveDialogDescription>
                    </ResponsiveDialogHeader>
                    <div className="space-y-2">
                        <Input
                            placeholder="Reason (optional)"
                            value={suspendReason}
                            onChange={(event) => setSuspendReason(event.target.value)}
                        />
                    </div>
                    <ResponsiveDialogFooter>
                        <ResponsiveDialogClose
                            render={<Button variant="outline">Cancel</Button>}
                        />
                        <Button
                            variant="destructive"
                            disabled={suspendMany.isPending || count === 0}
                            onClick={() => {
                                suspendMany.mutate(
                                    {ids, reason: suspendReason || undefined},
                                    {
                                        onSuccess: (result) =>
                                            finishSuccess(
                                                result.message,
                                                `Suspended ${count} ${count === 1 ? "tenant" : "tenants"}`
                                            ),
                                        onError: (error) =>
                                            toastApiError(error, "Failed to suspend tenants"),
                                    }
                                )
                            }}
                        >
                            {suspendMany.isPending ? <Spinner/> : null}
                            Suspend
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
                            Activate {count} {count === 1 ? "tenant" : "tenants"}
                        </ResponsiveDialogTitle>
                        <ResponsiveDialogDescription>
                            Restore platform access for the selected tenants.
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
                                            `Activated ${count} ${count === 1 ? "tenant" : "tenants"}`
                                        ),
                                    onError: (error) =>
                                        toastApiError(error, "Failed to activate tenants"),
                                })
                            }}
                        >
                            {activateMany.isPending ? <Spinner/> : null}
                            Activate
                        </Button>
                    </ResponsiveDialogFooter>
                </ResponsiveDialogContent>
            </ResponsiveDialog>
        </>
    )
}
