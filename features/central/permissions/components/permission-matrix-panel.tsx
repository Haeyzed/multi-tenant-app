"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { useCentralAuth } from "@/lib/providers/central-auth-provider"
import {
  useGetPermissionMatrix,
  useSyncRolePermissions,
} from "@/features/central/roles/hooks/use-role-query"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"
import { cn } from "@/lib/utils"

export function PermissionMatrixPanel() {
  const { hasPermission } = useCentralAuth()
  const canEdit = hasPermission("roles.assign-permissions")
  const { data, isLoading, error } = useGetPermissionMatrix()
  const syncRolePermissions = useSyncRolePermissions()
  const [draftMatrix, setDraftMatrix] = React.useState<Record<string, string[]>>(
    {}
  )
  const [dirtyRoles, setDirtyRoles] = React.useState<Set<number>>(new Set())
  const [isSaving, setIsSaving] = React.useState(false)

  useQueryErrorToast(error ?? null, "Failed to load permission matrix.")

  React.useEffect(() => {
    if (data?.matrix) {
      setDraftMatrix(data.matrix)
      setDirtyRoles(new Set())
    }
  }, [data?.matrix])

  const roles = data?.roles ?? []
  const groups = data?.groups ?? []

  const togglePermission = (
    roleId: number,
    permissionName: string,
    checked: boolean
  ) => {
    if (!canEdit) {
      return
    }

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

  const handleSave = async () => {
    if (!canEdit || dirtyRoles.size === 0) {
      return
    }

    setIsSaving(true)

    try {
      for (const roleId of dirtyRoles) {
        const result = await syncRolePermissions.mutateAsync({
          id: roleId,
          permissions: draftMatrix[String(roleId)] ?? [],
        })
        toastApiSuccess(result.message)
      }
      setDirtyRoles(new Set())
      toastApiSuccess(undefined, "Permission matrix saved successfully")
    } catch (saveError) {
      toastApiError(saveError, "Failed to save permission matrix")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          {canEdit
            ? "Toggle permissions per role, then save your changes."
            : "Read-only view of role permissions."}
        </p>
        {canEdit ? (
          <Button
            onClick={handleSave}
            disabled={isSaving || dirtyRoles.size === 0}
          >
            {isSaving ? <Spinner /> : null}
            Save changes
            {dirtyRoles.size > 0 ? ` (${dirtyRoles.size})` : ""}
          </Button>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="sticky left-0 z-20 min-w-56 border-b bg-muted/95 px-4 py-3 text-start font-medium">
                Permission
              </th>
              {roles.map((role) => (
                <th
                  key={role.id}
                  className="sticky top-0 z-10 min-w-36 border-b px-4 py-3 text-center font-medium capitalize"
                >
                  <div className="space-y-1">
                    <span>{role.name}</span>
                    <p className="text-muted-foreground text-xs font-normal">
                      {role.users_count} users
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <React.Fragment key={group.group}>
                <tr className="bg-muted/30">
                  <td
                    colSpan={roles.length + 1}
                    className="sticky left-0 border-b px-4 py-2 font-medium capitalize"
                  >
                    {group.group}
                  </td>
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
                          <div className="flex justify-center">
                            <Checkbox
                              checked={checked}
                              disabled={!canEdit || isSaving}
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
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
