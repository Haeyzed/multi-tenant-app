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
import {formatMoney} from "@/features/central/dashboard/lib/format"
import type {Subscription} from "@/types/central/subscription"

type SubscriptionsViewDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    subscription: Subscription
}

export function SubscriptionsViewDialog({
                                            open,
                                            onOpenChange,
                                            subscription,
                                        }: SubscriptionsViewDialogProps) {
    const rows = [
        ["Tenant", subscription.tenant?.name ?? subscription.tenant_id],
        ["Plan", subscription.plan?.name ?? String(subscription.plan_id)],
        [
            "Plan price",
            subscription.plan_price
                ? `${subscription.plan_price.currency} ${Number(subscription.plan_price.amount).toFixed(2)} / ${subscription.plan_price.billing_interval ?? "—"}`
                : subscription.plan_price_id
                    ? `#${subscription.plan_price_id}`
                    : "—",
        ],
        ["Billing interval", subscription.billing_interval ?? "—"],
        [
            "Price",
            formatMoney(Number(subscription.price), subscription.currency, "en-US"),
        ],
        ["Gateway", subscription.gateway ?? "—"],
        [
            "Trial ends",
            subscription.trial_ends_at
                ? new Date(subscription.trial_ends_at).toLocaleString()
                : "—",
        ],
        [
            "Starts",
            subscription.starts_at
                ? new Date(subscription.starts_at).toLocaleString()
                : "—",
        ],
        [
            "Current period",
            subscription.current_period_start && subscription.current_period_end
                ? `${new Date(subscription.current_period_start).toLocaleDateString()} – ${new Date(
                    subscription.current_period_end
                ).toLocaleDateString()}`
                : "—",
        ],
        [
            "Cancel at period end",
            subscription.cancel_at_period_end ? "Yes" : "No",
        ],
        [
            "Grace period",
            subscription.is_in_grace_period
                ? `Until ${subscription.grace_ends_at ? new Date(subscription.grace_ends_at).toLocaleString() : "—"}`
                : "No",
        ],
        [
            "Cancelled at",
            subscription.cancelled_at
                ? new Date(subscription.cancelled_at).toLocaleString()
                : "—",
        ],
        ["Cancellation reason", subscription.cancellation_reason ?? "—"],
        [
            "Created",
            new Date(subscription.created_at).toLocaleString(),
        ],
    ] as const

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>Subscription details</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Read-only overview for subscription #{subscription.id}.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className="capitalize">
                            {subscription.status_label ?? subscription.status}
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
