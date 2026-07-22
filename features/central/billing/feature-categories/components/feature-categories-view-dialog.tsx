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
import type {FeatureCategory} from "@/types/central/feature-category"

type FeatureCategoriesViewDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    category: FeatureCategory
}

export function FeatureCategoriesViewDialog({
                                                open,
                                                onOpenChange,
                                                category,
                                            }: FeatureCategoriesViewDialogProps) {
    const rows = [
        ["Slug", category.slug],
        ["Icon", category.icon ?? "—"],
        ["Sort order", String(category.sort_order ?? 0)],
        ["Features", String(category.features_count ?? 0)],
        [
            "Created",
            category.created_at_human ??
            new Date(category.created_at).toLocaleString(),
        ],
        [
            "Updated",
            category.updated_at_human ??
            (category.updated_at
                ? new Date(category.updated_at).toLocaleString()
                : "—"),
        ],
    ] as const

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>Feature category details</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Read-only overview for {category.name}.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className="capitalize">
                            {category.is_active ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                    {category.description ? (
                        <p className="text-muted-foreground">{category.description}</p>
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
