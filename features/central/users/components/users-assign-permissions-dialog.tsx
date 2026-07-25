"use client"

import * as React from "react"

import {Button} from "@/components/ui/button"
import {Checkbox} from "@/components/ui/checkbox"
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
import {useGetPermissions} from "@/features/central/roles/hooks/use-role-query"
import {useSyncUserPermissions} from "@/features/central/users/hooks/use-user-query"
import {toastApiError, toastApiSuccess} from "@/lib/toast-api"
import type {CentralUser} from "@/types/central/user"

type UsersAssignPermissionsDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: CentralUser
}

function UserPermissionsEditor({
    user,
    permissionGroups,
    isLoading,
    onOpenChange,
}: {
    user: CentralUser
    permissionGroups: NonNullable<
        ReturnType<typeof useGetPermissions>["data"]
    >
    isLoading: boolean
    onOpenChange: (open: boolean) => void
}) {
    const syncPermissions = useSyncUserPermissions()
    const [selectedPermissions, setSelectedPermissions] = React.useState(
        user.permissions ?? []
    )

    const togglePermission = (permissionName: string, checked: boolean) => {
        setSelectedPermissions((current) =>
            checked
                ? [...current, permissionName]
                : current.filter((permission) => permission !== permissionName)
        )
    }

    const handleSave = () => {
        syncPermissions.mutate(
            {id: user.id, permissions: selectedPermissions},
            {
                onSuccess: (result) => {
                    toastApiSuccess(
                        result.message,
                        "User permissions updated successfully"
                    )
                    onOpenChange(false)
                },
                onError: (error) => {
                    toastApiError(error, "Failed to update user permissions")
                },
            }
        )
    }

    return (
        <>
            <div className="max-h-80 space-y-4 overflow-y-auto pr-1">
                {isLoading ? (
                    <div className="flex justify-center py-6">
                        <Spinner/>
                    </div>
                ) : (permissionGroups ?? []).length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                        No permissions available.
                    </p>
                ) : (
                    (permissionGroups ?? []).map((group) => (
                        <div key={group.group} className="space-y-2">
                            <p className="text-sm font-medium capitalize">{group.group}</p>
                            <div className="space-y-2 rounded-md border p-3">
                                {group.permissions.map((permission) => (
                                    <label
                                        key={permission.id}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <Checkbox
                                            checked={selectedPermissions.includes(permission.name)}
                                            onCheckedChange={(checked) =>
                                                togglePermission(permission.name, !!checked)
                                            }
                                        />
                                        {permission.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ResponsiveDialogFooter>
                <ResponsiveDialogClose
                    render={<Button variant="outline">Cancel</Button>}
                />
                <Button onClick={handleSave} disabled={syncPermissions.isPending}>
                    {syncPermissions.isPending ? <Spinner/> : null}
                    Save permissions
                </Button>
            </ResponsiveDialogFooter>
        </>
    )
}

export function UsersAssignPermissionsDialog({
                                                 open,
                                                 onOpenChange,
                                                 user,
                                             }: UsersAssignPermissionsDialogProps) {
    const {data: permissionGroups, isLoading} = useGetPermissions(open)

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>Assign permissions</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Choose direct permissions for <strong>{user.name}</strong>.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                {open ? (
                    <UserPermissionsEditor
                        key={user.id}
                        user={user}
                        permissionGroups={permissionGroups}
                        isLoading={isLoading}
                        onOpenChange={onOpenChange}
                    />
                ) : null}
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}
