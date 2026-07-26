"use client"

import {type ColumnDef} from "@tanstack/react-table"
import {
    AlertTriangle,
    CalendarIcon,
    CheckCircle2,
    Clock,
    CreditCard,
    PauseCircle,
    Search,
    Sparkles,
    XCircle,
} from "lucide-react"

import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header"
import {Badge} from "@/components/ui/badge"
import {DataTableRowActions} from "@/features/central/billing/subscriptions/components/subscriptions-row-actions"
import {PAYMENT_GATEWAY_FILTER_OPTIONS} from "@/features/central/billing/shared/gateway-options"
import {formatMoney} from "@/features/central/shared/lib/format"
import type {Subscription, SubscriptionStatus,} from "@/types/central/subscription"

const statusVariantMap: Record<
    SubscriptionStatus,
    React.ComponentProps<typeof Badge>["variant"]
> = {
    pending: "outline",
    active: "secondary",
    trialing: "secondary",
    past_due: "destructive",
    cancelled: "outline",
    paused: "outline",
    expired: "destructive",
    unpaid: "destructive",
}

export const columns: ColumnDef<Subscription>[] = [
    {
        id: "id",
        accessorKey: "id",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Subscription"/>
        ),
        cell: ({row}) => (
            <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium">
          #{row.original.id} — {row.original.plan?.name ?? "—"}
        </span>
                <span className="text-muted-foreground truncate text-xs capitalize">
          {row.original.billing_interval ?? "—"}
        </span>
            </div>
        ),
        meta: {
            label: "Subscription",
            placeholder: "Search subscriptions...",
            variant: "text",
            icon: Search,
        },
        enableColumnFilter: true,
    },
    {
        id: "tenant",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Tenant"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {row.original.tenant?.name ?? row.original.tenant_id}
      </span>
        ),
    },
    {
        id: "status",
        accessorKey: "status",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Status"/>
        ),
        cell: ({row}) => {
            const status = row.getValue("status") as SubscriptionStatus
            return (
                <Badge
                    variant={statusVariantMap[status] ?? "outline"}
                    className="capitalize"
                >
                    {row.original.status_label ?? status}
                </Badge>
            )
        },
        meta: {
            label: "Status",
            variant: "select",
            options: [
                {label: "Pending", value: "pending", icon: Clock},
                {label: "Active", value: "active", icon: CheckCircle2},
                {label: "Trialing", value: "trialing", icon: Sparkles},
                {label: "Past Due", value: "past_due", icon: AlertTriangle},
                {label: "Cancelled", value: "cancelled", icon: XCircle},
                {label: "Paused", value: "paused", icon: PauseCircle},
                {label: "Expired", value: "expired", icon: XCircle},
                {label: "Unpaid", value: "unpaid", icon: AlertTriangle},
            ],
        },
        enableColumnFilter: true,
    },
    {
        accessorKey: "price",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Price"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {formatMoney(
            Number(row.original.price),
            row.original.currency,
            "en-US"
        )}
      </span>
        ),
    },
    {
        id: "gateway",
        accessorKey: "gateway",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Gateway"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground capitalize">
        {row.original.gateway ?? "—"}
      </span>
        ),
        meta: {
            label: "Gateway",
            variant: "select",
            icon: CreditCard,
            options: PAYMENT_GATEWAY_FILTER_OPTIONS,
        },
        enableColumnFilter: true,
    },
    {
        accessorKey: "current_period_end",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Period ends"/>
        ),
        cell: ({row}) =>
            row.original.current_period_end ? (
                <span className="text-muted-foreground">
          {new Date(row.original.current_period_end).toLocaleDateString()}
        </span>
            ) : (
                <span className="text-muted-foreground">—</span>
            ),
    },
    {
        accessorKey: "trial_ends_at",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Trial ends"/>
        ),
        cell: ({row}) =>
            row.original.trial_ends_at ? (
                <span className="text-muted-foreground">
          {new Date(row.original.trial_ends_at).toLocaleDateString()}
        </span>
            ) : (
                <span className="text-muted-foreground">—</span>
            ),
    },
    {
        id: "created_at",
        accessorKey: "created_at",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Created"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {new Date(row.getValue("created_at")).toLocaleDateString()}
      </span>
        ),
        meta: {
            label: "Date Range",
            variant: "dateRange",
            icon: CalendarIcon,
        },
        enableColumnFilter: true,
    },
    {
        id: "actions",
        header: () => null,
        cell: ({row}) => <DataTableRowActions row={row}/>,
        size: 32,
        enableSorting: false,
        enableHiding: false,
        enablePinning: true,
    },
]
