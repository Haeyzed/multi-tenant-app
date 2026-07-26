"use client"

import {type ColumnDef} from "@tanstack/react-table"
import {AlertOctagon, Ban, CheckCircle2, Clock, CreditCard, Loader, RotateCcw, Search, XCircle,} from "lucide-react"

import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header"
import {Badge} from "@/components/ui/badge"
import {DataTableRowActions} from "@/features/central/billing/payments/components/payments-row-actions"
import {PAYMENT_GATEWAY_FILTER_OPTIONS} from "@/features/central/billing/shared/gateway-options"
import {formatMoney} from "@/features/central/shared/lib/format"
import type {Payment, PaymentStatus} from "@/features/central/billing/payments/types"

const statusVariantMap: Record<
    PaymentStatus,
    React.ComponentProps<typeof Badge>["variant"]
> = {
    pending: "outline",
    processing: "outline",
    completed: "secondary",
    failed: "destructive",
    refunded: "outline",
    partially_refunded: "outline",
    disputed: "destructive",
    cancelled: "outline",
}

export const columns: ColumnDef<Payment>[] = [
    {
        id: "id",
        accessorKey: "id",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Payment"/>
        ),
        cell: ({row}) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">#{row.original.id}</span>
                <span className="text-muted-foreground truncate text-xs">
          {row.original.invoice?.number ?? "—"}
        </span>
            </div>
        ),
        meta: {
            label: "Payment",
            placeholder: "Search payments...",
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
            const status = row.getValue("status") as PaymentStatus
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
                {label: "Processing", value: "processing", icon: Loader},
                {label: "Completed", value: "completed", icon: CheckCircle2},
                {label: "Failed", value: "failed", icon: XCircle},
                {label: "Refunded", value: "refunded", icon: RotateCcw},
                {
                    label: "Partially Refunded",
                    value: "partially_refunded",
                    icon: RotateCcw,
                },
                {label: "Disputed", value: "disputed", icon: AlertOctagon},
                {label: "Cancelled", value: "cancelled", icon: Ban},
            ],
        },
        enableColumnFilter: true,
    },
    {
        accessorKey: "amount",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Amount"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {formatMoney(
            Number(row.original.amount),
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
        {row.original.gateway_label ?? row.original.gateway ?? "—"}
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
        accessorKey: "paid_at",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Paid"/>
        ),
        cell: ({row}) =>
            row.original.paid_at ? (
                <span className="text-muted-foreground">
          {new Date(row.original.paid_at).toLocaleDateString()}
        </span>
            ) : (
                <span className="text-muted-foreground">—</span>
            ),
    },
    {
        accessorKey: "created_at",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Created"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {new Date(row.getValue("created_at")).toLocaleDateString()}
      </span>
        ),
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
