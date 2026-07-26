"use client"

import * as React from "react"
import {LockIcon} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Checkbox} from "@/components/ui/checkbox"
import {Skeleton} from "@/components/ui/skeleton"
import {Spinner} from "@/components/ui/spinner"
import {PermissionGate} from "@/features/central/auth/components/permission-gate"
import {permissions} from "@/features/central/auth/permissions"
import {useGetPermissionMatrix, useSyncRolePermissions,} from "@/features/central/roles/hooks/use-role-query"
import {useQueryErrorToast} from "@/hooks/use-query-error-toast"
import {toastApiError, toastApiSuccess} from "@/lib/toast-api"
import {cn} from "@/lib/utils"

type PermissionMatrixRole = {
    id: number
    name: string
    users_count: number
}

type PermissionMatrixGroup = {
    group: string
    permissions: Array<{ id: number; name: string }>
}

function PermissionMatrixEditor({
    initialMatrix,
    roles,
    groups,
}: {
    initialMatrix: Record<string, string[]>
    roles: PermissionMatrixRole[]
    groups: PermissionMatrixGroup[]
}) {
    const syncRolePermissions = useSyncRolePermissions()
    const [draftMatrix, setDraftMatrix] = React.useState(initialMatrix)
    const [dirtyRoles, setDirtyRoles] = React.useState<Set<number>>(new Set())
    const [isSaving, setIsSaving] = React.useState(false)

    const allPermissionNames = React.useMemo(() => {
        return groups.flatMap((g) => g.permissions.map((p) => p.name))
    }, [groups])

    const togglePermission = (
        roleId: number,
        permissionName: string,
        checked: boolean
    ) => {
        const roleKey = String(roleId)
        const current = draftMatrix[roleKey] ?? []
        const next = checked
            ? [...current, permissionName]
            : current.filter((permission) => permission !== permissionName)

        setDraftMatrix((prev) => ({
            ...prev,
            [roleKey]: next,
        }))
        setDirtyRoles((prev) => new Set(prev).add(roleId))
    }

    const toggleAllForRole = (roleId: number, checked: boolean) => {
        const roleKey = String(roleId)
        const next = checked ? [...allPermissionNames] : []

        setDraftMatrix((prev) => ({
            ...prev,
            [roleKey]: next,
        }))
        setDirtyRoles((prev) => new Set(prev).add(roleId))
    }

    const toggleGroupForRole = (
        roleId: number,
        groupPermissions: string[],
        checked: boolean
    ) => {
        const roleKey = String(roleId)
        const current = draftMatrix[roleKey] ?? []

        const next = checked
            ? Array.from(new Set([...current, ...groupPermissions]))
            : current.filter((p) => !groupPermissions.includes(p))

        setDraftMatrix((prev) => ({
            ...prev,
            [roleKey]: next,
        }))
        setDirtyRoles((prev) => new Set(prev).add(roleId))
    }

    const handleSave = async () => {
        if (dirtyRoles.size === 0) {
            return
        }

        setIsSaving(true)

        try {
            for (const roleId of dirtyRoles) {
                await syncRolePermissions.mutateAsync({
                    id: roleId,
                    permissions: draftMatrix[String(roleId)] ?? [],
                })
            }
            setDirtyRoles(new Set())
            toastApiSuccess(undefined, "Permission matrix saved successfully")
        } catch (saveError) {
            toastApiError(saveError, "Failed to save permission matrix")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <PermissionGate
                    permissions={[permissions.roles.assignPermissions]}
                    fallback={
                        <p className="text-muted-foreground text-sm">
                            Read-only view of role permissions.
                        </p>
                    }
                >
                    <p className="text-muted-foreground text-sm">
                        Toggle permissions per role, then save your changes.
                    </p>
                </PermissionGate>
                <PermissionGate permissions={[permissions.roles.assignPermissions]}>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || dirtyRoles.size === 0}
                    >
                        {isSaving ? <Spinner/> : null}
                        Save changes
                        {dirtyRoles.size > 0 ? ` (${dirtyRoles.size})` : ""}
                    </Button>
                </PermissionGate>
            </div>

            <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-muted/50">
                    <tr>
                        <th className="sticky left-0 z-20 min-w-56 border-b bg-muted/95 px-4 py-3 text-start font-medium">
                            Permission
                        </th>
                        {roles.map((role) => {
                            const roleKey = String(role.id)
                            const rolePermissions = draftMatrix[roleKey] ?? []
                            const isAllSelected =
                                allPermissionNames.length > 0 &&
                                allPermissionNames.every((p) => rolePermissions.includes(p))
                            const isSomeSelected =
                                rolePermissions.length > 0 && !isAllSelected

                            return (
                                <th
                                    key={role.id}
                                    className="sticky top-0 z-10 min-w-36 border-b px-4 py-3 text-center font-medium capitalize"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="space-y-0.5 text-center">
                                            <span className="block font-semibold">{role.name}</span>
                                            <span className="text-muted-foreground block text-xs font-normal">
                            {role.users_count} users
                          </span>
                                        </div>
                                        <PermissionGate permissions={[permissions.roles.assignPermissions]}>
                                            <div className="flex items-center gap-1.5 pt-1">
                                                <Checkbox
                                                    checked={isAllSelected || (isSomeSelected ? "indeterminate" : false)}
                                                    disabled={isSaving}
                                                    onCheckedChange={(val) =>
                                                        toggleAllForRole(role.id, !!val)
                                                    }
                                                    aria-label={`Select all permissions for ${role.name}`}
                                                />
                                                <span className="text-muted-foreground text-[11px] font-normal">
                                Select all
                              </span>
                                            </div>
                                        </PermissionGate>
                                    </div>
                                </th>
                            )
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {groups.map((group) => {
                        const groupPermissionNames = group.permissions.map((p) => p.name)

                        return (
                            <React.Fragment key={group.group}>
                                <tr className="bg-muted/30">
                                    <td className="sticky left-0 z-10 border-b bg-muted/30 px-4 py-2 font-medium capitalize">
                                        {group.group}
                                    </td>
                                    {roles.map((role) => {
                                        const roleKey = String(role.id)
                                        const rolePermissions = draftMatrix[roleKey] ?? []
                                        const isGroupAllSelected =
                                            groupPermissionNames.length > 0 &&
                                            groupPermissionNames.every((p) =>
                                                rolePermissions.includes(p)
                                            )
                                        const isGroupSomeSelected =
                                            groupPermissionNames.some((p) =>
                                                rolePermissions.includes(p)
                                            ) && !isGroupAllSelected

                                        return (
                                            <td
                                                key={`group-${group.group}-role-${role.id}`}
                                                className="border-b px-4 py-2 text-center"
                                            >
                                                <PermissionGate permissions={[permissions.roles.assignPermissions]}>
                                                    <div className="flex justify-center">
                                                        <Checkbox
                                                            checked={
                                                                isGroupAllSelected ||
                                                                (isGroupSomeSelected ? "indeterminate" : false)
                                                            }
                                                            disabled={isSaving}
                                                            onCheckedChange={(val) =>
                                                                toggleGroupForRole(
                                                                    role.id,
                                                                    groupPermissionNames,
                                                                    !!val
                                                                )
                                                            }
                                                            aria-label={`Select all ${group.group} permissions for ${role.name}`}
                                                        />
                                                    </div>
                                                </PermissionGate>
                                            </td>
                                        )
                                    })}
                                </tr>
                                {group.permissions.map((permission) => (
                                    <tr key={permission.id} className="border-b last:border-b-0">
                                        <td className="sticky left-0 z-10 border-r bg-background px-4 py-3">
                                            {permission.name}
                                        </td>
                                        {roles.map((role) => {
                                            const roleKey = String(role.id)
                                            const checked = (draftMatrix[roleKey] ?? []).includes(
                                                permission.name
                                            )
                                            const isDirty = dirtyRoles.has(role.id)

                                            return (
                                                <td
                                                    key={`${role.id}-${permission.id}`}
                                                    className={cn(
                                                        "px-4 py-3 text-center",
                                                        isDirty && "bg-primary/5"
                                                    )}
                                                >
                                                    <PermissionGate
                                                        permissions={[permissions.roles.assignPermissions]}>
                                                        <div className="flex justify-center">
                                                            <Checkbox
                                                                checked={checked}
                                                                disabled={isSaving}
                                                                onCheckedChange={(value) =>
                                                                    togglePermission(
                                                                        role.id,
                                                                        permission.name,
                                                                        !!value
                                                                    )
                                                                }
                                                                aria-label={`${permission.name} for ${role.name}`}
                                                            />
                                                        </div>
                                                    </PermissionGate>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </React.Fragment>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export function PermissionsMatrixPanel() {
    const {data, isLoading, error} = useGetPermissionMatrix()

    useQueryErrorToast(error ?? null, "Failed to load permission matrix.")

    const roles = data?.roles ?? []
    const groups = data?.groups ?? []
    const matrixKey = data?.matrix ? JSON.stringify(data.matrix) : null

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-40"/>
                <Skeleton className="h-96 rounded-xl"/>
            </div>
        )
    }

    return (
        <PermissionGate
            permissions={[permissions.permissions.view]}
            fallback={
                <div
                    className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
                    <LockIcon className="text-muted-foreground mb-2 size-8"/>
                    <h3 className="font-semibold">Access Restricted</h3>
                    <p className="text-muted-foreground text-sm">
                        You do not have permission to view the role permissions matrix.
                    </p>
                </div>
            }
        >
            {matrixKey && data?.matrix ? (
                <PermissionMatrixEditor
                    key={matrixKey}
                    initialMatrix={data.matrix}
                    roles={roles}
                    groups={groups}
                />
            ) : null}
        </PermissionGate>
    )
}
