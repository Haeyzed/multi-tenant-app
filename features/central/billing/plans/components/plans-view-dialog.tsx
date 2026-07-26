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
import {Spinner} from "@/components/ui/spinner"
import {useGetPlan} from "@/features/central/billing/plans/hooks/use-plan-query"
import type {Plan} from "@/features/central/billing/plans/types"

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
    const {data: details, isLoading} = useGetPlan(plan.id, open)
    const view = details ?? plan
    const primaryPrice = view.resolved_price ?? view.prices?.[0]
    const rows = [
        ["Slug", view.slug],
        [
            "Primary price",
            primaryPrice
                ? formatPrice(primaryPrice)
                : view.currency && view.price != null
                    ? `${view.currency} ${Number(view.price).toFixed(2)}`
                    : "—",
        ],
        [
            "Interval",
            view.billing_interval_label ?? view.billing_interval ?? "—",
        ],
        ["Trial days", String(view.trial_days ?? 0)],
        ["Visibility", view.visibility_label ?? view.visibility],
        ["Featured", view.is_featured ? "Yes" : "No"],
        ["Sort order", String(view.sort_order ?? 0)],
        [
            "Created",
            view.created_at_human ?? new Date(view.created_at).toLocaleString(),
        ],
        [
            "Updated",
            view.updated_at_human ??
            (view.updated_at
                ? new Date(view.updated_at).toLocaleString()
                : "—"),
        ],
    ] as const

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>Plan details</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Read-only overview for {view.name}.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <div className="max-h-[65vh] space-y-3 overflow-y-auto pe-1 text-sm">
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Spinner/> Loading plan details...
                        </div>
                    ) : null}
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className="capitalize">
                            {view.status_label ?? view.status}
                        </Badge>
                    </div>
                    {view.description ? (
                        <p className="text-muted-foreground">{view.description}</p>
                    ) : null}
                    {view.prices && view.prices.length > 0 ? (
                        <div className="flex flex-col gap-1.5 rounded-lg border p-3">
              <span className="text-muted-foreground">
                Prices by currency
              </span>
                            <div className="flex flex-wrap gap-2">
                                {view.prices.map((price) => (
                                    <Badge key={price.id} variant="outline">
                                        {formatPrice(price)}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    ) : null}
                    {view.features && view.features.length > 0 ? (
                        <div className="flex flex-col gap-1.5 rounded-lg border p-3">
                            <span className="text-muted-foreground">Features</span>
                            <div className="flex flex-wrap gap-2">
                                {view.features.map((feature) => (
                                    <Badge key={feature.id} variant="secondary">
                                        {feature.name}
                                        {feature.pivot?.is_unlimited
                                            ? " · unlimited"
                                            : feature.pivot?.limit_value != null
                                                ? ` · ${feature.pivot.limit_value}`
                                                : ""}
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
