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
import {UsersAssignPermissionsDialog} from "@/features/central/users/components/users-assign-permissions-dialog"
import {UsersAssignRolesDialog} from "@/features/central/users/components/users-assign-roles-dialog"
import {UsersActivitiesDialog} from "@/features/central/users/components/users-activities-dialog"
import {UsersFormDialog} from "@/features/central/users/components/users-form-dialog"
import {useUsers} from "@/features/central/users/components/users-provider"
import {UsersSecurityDialog} from "@/features/central/users/components/users-security-dialog"
import {UsersViewDialog} from "@/features/central/users/components/users-view-dialog"
import {useActivateUser, useDeleteUser, useSuspendUser,} from "@/features/central/users/hooks/use-user-query"
import {toastApiError, toastApiSuccess} from "@/lib/toast-api"

export function UsersDialogs() {
    const {open, setOpen, currentRow, setCurrentRow} = useUsers()
    const deleteUser = useDeleteUser()
    const activateUser = useActivateUser()
    const suspendUser = useSuspendUser()
    const [isMutating, setIsMutating] = React.useState(false)

    const handleClose = React.useCallback(() => {
        setOpen(null)
        setTimeout(() => {
            setCurrentRow(null)
        }, 300)
    }, [setOpen, setCurrentRow])

    const runAction = (action: "delete" | "activate" | "suspend") => {
        if (!currentRow) {
            return
        }

        setIsMutating(true)

        const onSuccess = (message?: string) => {
            toastApiSuccess(
                message,
                `User "${currentRow.name}" ${action}d successfully`
            )
            setIsMutating(false)
            handleClose()
        }

        const onError = (error: unknown) => {
            toastApiError(error, `Failed to ${action} user`)
            setIsMutating(false)
        }

        if (action === "delete") {
            deleteUser.mutate(currentRow.id, {
                onSuccess: (result) => onSuccess(result.message),
                onError,
            })
            return
        }

        if (action === "activate") {
            activateUser.mutate(currentRow.id, {
                onSuccess: (result) => onSuccess(result.message),
                onError,
            })
            return
        }

        suspendUser.mutate(currentRow.id, {
            onSuccess: (result) => onSuccess(result.message),
            onError,
        })
    }

    return (
        <>
            <UsersFormDialog
                open={open === "create"}
                onOpenChange={(val) => {
                    if (!val) {
                        setOpen(null)
                    }
                }}
            />

            {currentRow ? (
                <>
                    <UsersFormDialog
                        key={`user-update-${currentRow.id}`}
                        open={open === "update"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                        currentRow={currentRow}
                    />

                    <UsersViewDialog
                        key={`user-view-${currentRow.id}`}
                        open={open === "view"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                        user={currentRow}
                    />

                    <UsersAssignRolesDialog
                        key={`user-assign-roles-${currentRow.id}`}
                        open={open === "assignRoles"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                        user={currentRow}
                    />

                    <UsersAssignPermissionsDialog
                        key={`user-assign-permissions-${currentRow.id}`}
                        open={open === "assignPermissions"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                        user={currentRow}
                    />

                    <UsersSecurityDialog
                        key={`user-security-${currentRow.id}`}
                        open={open === "security"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                        user={currentRow}
                    />

                    <UsersActivitiesDialog
                        key={`user-activities-${currentRow.id}`}
                        open={open === "activities"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                        user={currentRow}
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
                                <ResponsiveDialogTitle>Delete user</ResponsiveDialogTitle>
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
                                    disabled={isMutating}
                                    onClick={() => runAction("delete")}
                                >
                                    {isMutating ? <Spinner/> : null}
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
                                <ResponsiveDialogTitle>Activate user</ResponsiveDialogTitle>
                                <ResponsiveDialogDescription>
                                    Activate <strong>{currentRow.name}</strong> and restore
                                    platform access.
                                </ResponsiveDialogDescription>
                            </ResponsiveDialogHeader>
                            <ResponsiveDialogFooter>
                                <ResponsiveDialogClose
                                    render={<Button variant="outline">Cancel</Button>}
                                />
                                <Button
                                    disabled={isMutating}
                                    onClick={() => runAction("activate")}
                                >
                                    {isMutating ? <Spinner/> : null}
                                    Activate
                                </Button>
                            </ResponsiveDialogFooter>
                        </ResponsiveDialogContent>
                    </ResponsiveDialog>

                    <ResponsiveDialog
                        open={open === "suspend"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                    >
                        <ResponsiveDialogContent className="sm:max-w-md">
                            <ResponsiveDialogHeader>
                                <ResponsiveDialogTitle>Suspend user</ResponsiveDialogTitle>
                                <ResponsiveDialogDescription>
                                    Suspend <strong>{currentRow.name}</strong> and revoke active
                                    sessions.
                                </ResponsiveDialogDescription>
                            </ResponsiveDialogHeader>
                            <ResponsiveDialogFooter>
                                <ResponsiveDialogClose
                                    render={<Button variant="outline">Cancel</Button>}
                                />
                                <Button
                                    variant="destructive"
                                    disabled={isMutating}
                                    onClick={() => runAction("suspend")}
                                >
                                    {isMutating ? <Spinner/> : null}
                                    Suspend
                                </Button>
                            </ResponsiveDialogFooter>
                        </ResponsiveDialogContent>
                    </ResponsiveDialog>
                </>
            ) : null}
        </>
    )
}
