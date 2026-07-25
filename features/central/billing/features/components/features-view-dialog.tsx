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
import type {Feature} from "@/types/central/feature"

type FeaturesViewDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    feature: Feature
}

const limitTypeLabels: Record<string, string> = {
    unlimited: "Unlimited",
    count: "Count Limit",
    storage: "Storage Limit",
    bandwidth: "Bandwidth Limit",
    periodic: "Periodic Limit",
    boolean: "Enabled/Disabled",
}

export function FeaturesViewDialog({
                                       open,
                                       onOpenChange,
                                       feature,
                                   }: FeaturesViewDialogProps) {
    const rows = [
        ["Slug", feature.slug],
        ["Key", feature.key],
        ["Category", feature.category?.name ?? "—"],
        [
            "Limit type",
            feature.default_limit_type
                ? limitTypeLabels[feature.default_limit_type] ??
                feature.default_limit_type
                : "—",
        ],
        ["Limit value", String(feature.default_limit_value ?? "—")],
        ["Unit", feature.unit ?? "—"],
        ["Available", feature.is_available ? "Yes" : "No"],
        ["Tracks usage", feature.tracks_usage ? "Yes" : "No"],
        ["Sort order", String(feature.sort_order ?? 0)],
        [
            "Created",
            feature.created_at_human ??
            new Date(feature.created_at).toLocaleString(),
        ],
        [
            "Updated",
            feature.updated_at_human ??
            (feature.updated_at
                ? new Date(feature.updated_at).toLocaleString()
                : "—"),
        ],
    ] as const

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>Feature details</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Read-only overview for {feature.name}.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <div className="max-h-[65vh] space-y-3 overflow-y-auto pe-1 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className="capitalize">
                            {feature.status_label ?? feature.status}
                        </Badge>
                    </div>
                    {feature.description ? (
                        <p className="text-muted-foreground">{feature.description}</p>
                    ) : null}
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
