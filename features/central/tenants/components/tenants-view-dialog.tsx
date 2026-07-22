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
import type {Tenant} from "@/types/central/tenant"

type TenantsViewDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    tenant: Tenant
}

export function TenantsViewDialog({
                                      open,
                                      onOpenChange,
                                      tenant,
                                  }: TenantsViewDialogProps) {
    const rows = [
        ["Name", tenant.name],
        ["Slug", tenant.slug],
        ["Email", tenant.email || "—"],
        ["Phone", tenant.phone || "—"],
        ["Domains", String(tenant.domains_count ?? tenant.domains?.length ?? 0)],
        [
            "Trial ends",
            tenant.trial_ends_at
                ? new Date(tenant.trial_ends_at).toLocaleString()
                : "—",
        ],
        ["Created", tenant.created_at_human ?? new Date(tenant.created_at).toLocaleString()],
    ] as const

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>Tenant details</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Read-only overview for {tenant.name}.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className="capitalize">
                            {tenant.status_label ?? tenant.status.replaceAll("_", " ")}
                        </Badge>
                    </div>
                    {rows.map(([label, value]) => (
                        <div
                            key={label}
                            className="flex items-start justify-between gap-4 border-b pb-2 last:border-b-0"
                        >
                            <span className="text-muted-foreground">{label}</span>
                            <span className="text-end font-medium">{value}</span>
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
