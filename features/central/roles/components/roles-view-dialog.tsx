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
import type {CentralRole} from "@/types/central/rbac"

type RolesViewDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    role: CentralRole
}

export function RolesViewDialog({
                                    open,
                                    onOpenChange,
                                    role,
                                }: RolesViewDialogProps) {
    const rows = [
        ["Name", role.name],
        ["Guard", role.guard_name || "—"],
        ["Users", String(role.users_count ?? 0)],
        [
            "Created",
            role.created_at
                ? new Date(role.created_at).toLocaleString()
                : "—",
        ],
    ] as const

    const permissions = role.permissions ?? []

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>Role details</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Read-only overview for {role.name}.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <div className="space-y-3 text-sm">
                    {rows.map(([label, value]) => (
                        <div
                            key={label}
                            className="flex items-start justify-between gap-4 border-b pb-2 last:border-b-0"
                        >
                            <span className="text-muted-foreground">{label}</span>
                            <span className="text-end font-medium capitalize">{value}</span>
                        </div>
                    ))}
                    <div className="space-y-2 border-b pb-2">
                        <span className="text-muted-foreground">Permissions</span>
                        {permissions.length === 0 ? (
                            <p className="text-muted-foreground">—</p>
                        ) : (
                            <div className="flex flex-wrap gap-1">
                                {permissions.map((permission) => (
                                    <Badge key={permission} variant="outline">
                                        {permission}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
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
