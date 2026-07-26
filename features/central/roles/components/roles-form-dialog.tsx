"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import * as React from "react"
import {useForm} from "react-hook-form"

import {Button} from "@/components/ui/button"
import {Checkbox} from "@/components/ui/checkbox"
import {Field, FieldContent, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
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
import {PermissionGate} from "@/features/central/auth/components/permission-gate"
import {permissions} from "@/features/central/auth/permissions"
import {useCreateRole, useGetPermissions, useUpdateRole,} from "@/features/central/roles/hooks/use-role-query"
import {type StoreRoleFormValues, storeRoleSchema, type UpdateRoleFormValues,} from "@/features/central/roles/schemas"
import {handleFormApiError} from "@/lib/form-api-errors"
import {toastApiSuccess} from "@/lib/toast-api"
import type {CentralRole} from "@/features/central/roles/types"
import {LockIcon} from "lucide-react"

type RolesFormDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: CentralRole
}

export function RolesFormDialog({
                                    open,
                                    onOpenChange,
                                    currentRow,
                                }: RolesFormDialogProps) {
    const isUpdate = !!currentRow
    const createRole = useCreateRole()
    const updateRole = useUpdateRole()
    const isSubmitting = createRole.isPending || updateRole.isPending
    const {data: permissionGroups} = useGetPermissions(open)

    const form = useForm<StoreRoleFormValues>({
        resolver: zodResolver(storeRoleSchema),
        defaultValues: {
            name: "",
            permissions: [],
        },
    })

    React.useEffect(() => {
        if (!open) {
            return
        }

        if (currentRow) {
            form.reset({
                name: currentRow.name,
                permissions: currentRow.permissions ?? [],
            })
        } else {
            form.reset({
                name: "",
                permissions: [],
            })
        }
    }, [open, currentRow, form])

    const selectedPermissions = form.watch("permissions") ?? []

    const togglePermission = (permissionName: string, checked: boolean) => {
        const next = checked
            ? [...selectedPermissions, permissionName]
            : selectedPermissions.filter((permission) => permission !== permissionName)
        form.setValue("permissions", next, {shouldDirty: true, shouldValidate: true})
    }

    const onSubmit = (data: StoreRoleFormValues) => {
        if (isUpdate && currentRow) {
            const updateValues: UpdateRoleFormValues = {
                name: data.name,
                permissions: data.permissions,
            }

            updateRole.mutate(
                {id: currentRow.id, values: updateValues},
                {
                    onSuccess: (result) => {
                        toastApiSuccess(result.message, "Role updated successfully")
                        onOpenChange(false)
                    },
                    onError: (error) => {
                        handleFormApiError(error, form.setError, "Failed to update role")
                    },
                }
            )
            return
        }

        createRole.mutate(data,
            {
                onSuccess: (result) => {
                    toastApiSuccess(result.message, "Role created successfully")
                    onOpenChange(false)
                },
                onError: (error) => {
                    handleFormApiError(error, form.setError, "Failed to create role")
                },
            }
        )
    }

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>
                        {isUpdate ? "Edit role" : "Create role"}
                    </ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        {isUpdate
                            ? "Update role details and optional permissions."
                            : "Create a new platform role with optional permissions."}
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <form
                    id="role-form"
                    className="space-y-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <FieldContent>
                                <Input
                                    {...form.register("name")}
                                    placeholder="support-lead"
                                    disabled={isUpdate && currentRow?.name === "super-admin"}
                                />
                                <FieldError
                                    errors={
                                        form.formState.errors.name
                                            ? [form.formState.errors.name]
                                            : []
                                    }
                                />
                            </FieldContent>
                        </Field>

                        <PermissionGate permissions={[permissions.roles.assignPermissions]}>
                            <Field>
                                <FieldLabel>Permissions</FieldLabel>
                                <FieldContent>
                                    <div className="max-h-56 space-y-4 overflow-y-auto pr-1">
                                        {(permissionGroups ?? []).map((group) => (
                                            <div key={group.group} className="space-y-2">
                                                <p className="text-sm font-medium capitalize">
                                                    {group.group}
                                                </p>
                                                <div className="space-y-2 rounded-md border p-3">
                                                    {group.permissions.map((permission) => (
                                                        <label
                                                            key={permission.id}
                                                            className="flex items-center gap-2 text-sm"
                                                        >
                                                            <Checkbox
                                                                checked={selectedPermissions.includes(
                                                                    permission.name
                                                                )}
                                                                onCheckedChange={(checked) =>
                                                                    togglePermission(permission.name, !!checked)
                                                                }
                                                            />
                                                            {permission.name}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <FieldError
                                        errors={
                                            form.formState.errors.permissions
                                                ? [form.formState.errors.permissions]
                                                : []
                                        }
                                    />
                                </FieldContent>
                            </Field>
                        </PermissionGate>
                    </FieldGroup>
                </form>

                <ResponsiveDialogFooter>
                    <ResponsiveDialogClose
                        render={<Button variant="outline">Cancel</Button>}
                    />
                    <PermissionGate
                        permissions={[isUpdate ? permissions.roles.update : permissions.roles.create]}
                        fallback={
                            <Button disabled variant="outline">
                                <LockIcon className="mr-1.5 size-3.5"/>
                                {isUpdate ? "Save changes (Locked)" : "Create role (Locked)"}
                            </Button>
                        }
                    >
                        <Button type="submit" form="role-form" disabled={isSubmitting}>
                            {isSubmitting ? <Spinner/> : null}
                            {isUpdate ? "Save changes" : "Create role"}
                        </Button>
                    </PermissionGate>
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}
