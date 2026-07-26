"use client"

import {type ColumnDef} from "@tanstack/react-table"
import {AlertTriangle, CheckCircle2, Clock, FileText, Search, Slash, XCircle,} from "lucide-react"

import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header"
import {Badge} from "@/components/ui/badge"
import {DataTableRowActions} from "@/features/central/billing/invoices/components/invoices-row-actions"
import {formatMoney} from "@/features/central/shared/lib/format"
import type {Invoice, InvoiceStatus} from "@/features/central/billing/invoices/types"

const statusVariantMap: Record<
    InvoiceStatus,
    React.ComponentProps<typeof Badge>["variant"]
> = {
    draft: "outline",
    open: "secondary",
    paid: "secondary",
    uncollectible: "destructive",
    void: "outline",
    pending: "outline",
    overdue: "destructive",
}

export const columns: ColumnDef<Invoice>[] = [
    {
        id: "number",
        accessorKey: "number",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Invoice"/>
        ),
        cell: ({row}) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">{row.original.number}</span>
                <span className="text-muted-foreground truncate text-xs">
          #{row.original.id}
        </span>
            </div>
        ),
        meta: {
            label: "Invoice",
            placeholder: "Search invoices...",
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
            const status = row.getValue("status") as InvoiceStatus
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
                {label: "Draft", value: "draft", icon: FileText},
                {label: "Open", value: "open", icon: Clock},
                {label: "Paid", value: "paid", icon: CheckCircle2},
                {
                    label: "Uncollectible",
                    value: "uncollectible",
                    icon: AlertTriangle,
                },
                {label: "Void", value: "void", icon: Slash},
                {label: "Pending", value: "pending", icon: Clock},
                {label: "Overdue", value: "overdue", icon: XCircle},
            ],
        },
        enableColumnFilter: true,
    },
    {
        accessorKey: "total",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Total"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {formatMoney(
            Number(row.original.total),
            row.original.currency,
            "en-US"
        )}
      </span>
        ),
    },
    {
        accessorKey: "balance_due",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Balance due"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {formatMoney(
            Number(row.original.balance_due),
            row.original.currency,
            "en-US"
        )}
      </span>
        ),
    },
    {
        accessorKey: "due_at",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Due"/>
        ),
        cell: ({row}) =>
            row.original.due_at ? (
                <span className="text-muted-foreground">
          {new Date(row.original.due_at).toLocaleDateString()}
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
