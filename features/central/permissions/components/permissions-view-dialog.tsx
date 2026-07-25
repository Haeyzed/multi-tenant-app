"use client"

import {Badge} from "@/components/ui/badge"
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
import type {PermissionItem} from "@/types/central/rbac"

type PermissionsViewDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    permission: PermissionItem
}

export function PermissionsViewDialog({
                                          open,
                                          onOpenChange,
                                          permission,
                                      }: PermissionsViewDialogProps) {
    const group = permission.group ?? permission.name.split(".")[0]

    const rows = [
        ["Name", permission.name],
        ["Group", group || "—"],
        ["Guard", permission.guard_name || "—"],
        [
            "Created",
            permission.created_at
                ? new Date(permission.created_at).toLocaleString()
                : "—",
        ],
        [
            "Updated",
            permission.updated_at
                ? new Date(permission.updated_at).toLocaleString()
                : "—",
        ],
    ] as const

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>Permission details</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Read-only overview for {permission.name}.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <div className="max-h-[65vh] space-y-3 overflow-y-auto pe-1 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Group</span>
                        <Badge variant="outline" className="capitalize">
                            {group || "—"}
                        </Badge>
                    </div>
                    {rows.map(([label, value]) => (
                        <div
                            key={label}
                            className="flex items-start justify-between gap-4 border-b pb-2 last:border-b-0"
                        >
                            <span className="text-muted-foreground">{label}</span>
                            <span className="text-end font-medium font-mono text-sm">
                {value}
              </span>
                        </div>
                    ))}
                </div>

                <ResponsiveDialogFooter>
                    <ResponsiveDialogClose
                        render={<Button variant="outline">Close</Button>}
                    />
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}
