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
import {useGetRoles} from "@/features/central/roles/hooks/use-role-query"
import {useSyncUserRoles,} from "@/features/central/users/hooks/use-user-query"
import {toastApiError, toastApiSuccess} from "@/lib/toast-api"
import type {CentralUser} from "@/types/central/user"

type UsersAssignRolesDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: CentralUser
}

export function UsersAssignRolesDialog({
                                           open,
                                           onOpenChange,
                                           user,
                                       }: UsersAssignRolesDialogProps) {
    const {data: rolesData, isLoading} = useGetRoles(open)
    const syncRoles = useSyncUserRoles()
    const [selectedRoles, setSelectedRoles] = React.useState<string[]>([])

    React.useEffect(() => {
        if (open) {
            setSelectedRoles(user.roles ?? [])
        }
    }, [open, user.roles])

    const roleOptions = rolesData?.data ?? []

    const toggleRole = (roleName: string, checked: boolean) => {
        setSelectedRoles((current) =>
            checked
                ? [...current, roleName]
                : current.filter((role) => role !== roleName)
        )
    }

    const handleSave = () => {
        syncRoles.mutate(
            {id: user.id, roles: selectedRoles},
            {
                onSuccess: (result) => {
                    toastApiSuccess(result.message, "User roles updated successfully")
                    onOpenChange(false)
                },
                onError: (error) => {
                    toastApiError(error, "Failed to update user roles")
                },
            }
        )
    }

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-md">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>Assign roles</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Choose roles for <strong>{user.name}</strong>.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border p-3">
                    {isLoading ? (
                        <div className="flex justify-center py-6">
                            <Spinner/>
                        </div>
                    ) : roleOptions.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No roles available.</p>
                    ) : (
                        roleOptions.map((role) => (
                            <label
                                key={role.id}
                                className="flex items-center gap-2 text-sm capitalize"
                            >
                                <Checkbox
                                    checked={selectedRoles.includes(role.name)}
                                    onCheckedChange={(checked) =>
                                        toggleRole(role.name, !!checked)
                                    }
                                />
                                {role.name}
                            </label>
                        ))
                    )}
                </div>

                <ResponsiveDialogFooter>
                    <ResponsiveDialogClose
                        render={<Button variant="outline">Cancel</Button>}
                    />
                    <Button onClick={handleSave} disabled={syncRoles.isPending}>
                        {syncRoles.isPending ? <Spinner/> : null}
                        Save roles
                    </Button>
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}
