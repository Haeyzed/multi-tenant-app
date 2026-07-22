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
import type {Plan} from "@/types/central/plan"

function formatPrice(price: {
    currency: string
    amount: string | number
    billing_interval_label?: string | null
    billing_interval?: string | null
}): string {
    return `${price.currency} ${Number(price.amount).toFixed(2)}/${
        price.billing_interval_label ?? price.billing_interval ?? "mo"
    }`
}

type PlansViewDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    plan: Plan
}

export function PlansViewDialog({
                                    open,
                                    onOpenChange,
                                    plan,
                                }: PlansViewDialogProps) {
    const rows = [
        ["Slug", plan.slug],
        ["Price", `${plan.currency} ${Number(plan.price).toFixed(2)}`],
        [
            "Interval",
            plan.billing_interval_label ?? plan.billing_interval ?? "—",
        ],
        ["Trial days", String(plan.trial_days ?? 0)],
        ["Visibility", plan.visibility_label ?? plan.visibility],
        ["Featured", plan.is_featured ? "Yes" : "No"],
        ["Sort order", String(plan.sort_order ?? 0)],
        [
            "Created",
            plan.created_at_human ?? new Date(plan.created_at).toLocaleString(),
        ],
        [
            "Updated",
            plan.updated_at_human ??
            (plan.updated_at
                ? new Date(plan.updated_at).toLocaleString()
                : "—"),
        ],
    ] as const

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>Plan details</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Read-only overview for {plan.name}.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className="capitalize">
                            {plan.status_label ?? plan.status}
                        </Badge>
                    </div>
                    {plan.description ? (
                        <p className="text-muted-foreground">{plan.description}</p>
                    ) : null}
                    {plan.prices && plan.prices.length > 0 ? (
                        <div className="space-y-1.5 rounded-lg border p-3">
              <span className="text-muted-foreground">
                Prices by currency
              </span>
                            <div className="flex flex-wrap gap-2">
                                {plan.prices.map((price) => (
                                    <Badge key={price.id} variant="outline">
                                        {formatPrice(price)}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ) : null}
                    {rows.map(([label, value]) => (
                        <div
                            key={label}
                            className="flex items-start justify-between gap-4 border-b pb-2 last:border-b-0"
                        >
                            <span className="text-muted-foreground">{label}</span>
                            <span className="text-end font-medium capitalize">{value}</span>
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
