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
import {PermissionsFormDialog} from "@/features/central/permissions/components/permissions-form-dialog"
import {usePermissions} from "@/features/central/permissions/components/permissions-provider"
import {PermissionsViewDialog} from "@/features/central/permissions/components/permissions-view-dialog"
import {useDeletePermission} from "@/features/central/permissions/hooks/use-permission-query"
import {toastApiError, toastApiSuccess} from "@/lib/toast-api"

export function PermissionsDialogs() {
    const {open, setOpen, currentRow, setCurrentRow} = usePermissions()
    const deletePermission = useDeletePermission()
    const [isMutating, setIsMutating] = React.useState(false)

    const handleClose = React.useCallback(() => {
        setOpen(null)
        setTimeout(() => {
            setCurrentRow(null)
        }, 300)
    }, [setOpen, setCurrentRow])

    const runDelete = () => {
        if (!currentRow) {
            return
        }

        setIsMutating(true)
        deletePermission.mutate(currentRow.id, {
            onSuccess: (result) => {
                toastApiSuccess(
                    result.message,
                    `Permission "${currentRow.name}" deleted successfully`
                )
                setIsMutating(false)
                handleClose()
            },
            onError: (error) => {
                toastApiError(error, "Failed to delete permission")
                setIsMutating(false)
            },
        })
    }

    return (
        <>
            <PermissionsFormDialog
                open={open === "create"}
                onOpenChange={(val) => {
                    if (!val) {
                        setOpen(null)
                    }
                }}
            />

            {currentRow ? (
                <>
                    <PermissionsFormDialog
                        key={`permission-update-${currentRow.id}`}
                        open={open === "update"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                        currentRow={currentRow}
                    />

                    <PermissionsViewDialog
                        key={`permission-view-${currentRow.id}`}
                        open={open === "view"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                        permission={currentRow}
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
                                <ResponsiveDialogTitle>Delete permission</ResponsiveDialogTitle>
                                <ResponsiveDialogDescription>
                                    Delete <strong>{currentRow.name}</strong>? Roles and users
                                    that reference it will lose this permission.
                                </ResponsiveDialogDescription>
                            </ResponsiveDialogHeader>
                            <ResponsiveDialogFooter>
                                <ResponsiveDialogClose
                                    render={<Button variant="outline">Cancel</Button>}
                                />
                                <Button
                                    variant="destructive"
                                    disabled={isMutating}
                                    onClick={runDelete}
                                >
                                    {isMutating ? <Spinner/> : null}
                                    Delete
                                </Button>
                            </ResponsiveDialogFooter>
                        </ResponsiveDialogContent>
                    </ResponsiveDialog>
                </>
            ) : null}
        </>
    )
}
