"use client"

import {type ColumnDef} from "@tanstack/react-table"
import {Archive, CheckCircle2, EyeOff, Search} from "lucide-react"

import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header"
import {Badge} from "@/components/ui/badge"
import {Checkbox} from "@/components/ui/checkbox"
import {DataTableRowActions} from "@/features/central/billing/features/components/features-row-actions"
import type {Feature, FeatureStatus} from "@/types/central/feature"

const statusVariantMap: Record<
    FeatureStatus,
    React.ComponentProps<typeof Badge>["variant"]
> = {
    active: "secondary",
    inactive: "outline",
    deprecated: "destructive",
}

const limitTypeLabels: Record<string, string> = {
    unlimited: "Unlimited",
    count: "Count Limit",
    storage: "Storage Limit",
    bandwidth: "Bandwidth Limit",
    periodic: "Periodic Limit",
    boolean: "Enabled/Disabled",
}

export const columns: ColumnDef<Feature>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                indeterminate={table.getIsSomePageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
        enablePinning: true,
    },
    {
        id: "name",
        accessorKey: "name",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Name"/>
        ),
        meta: {
            label: "Name",
            placeholder: "Search features...",
            variant: "text",
            icon: Search,
        },
        enableColumnFilter: true,
        cell: ({row}) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">{row.original.name}</span>
                <span className="text-muted-foreground truncate text-xs">
          {row.original.slug}
        </span>
            </div>
        ),
    },
    {
        accessorKey: "key",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Key"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground font-mono text-xs">
        {row.original.key}
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
            const status = row.getValue("status") as FeatureStatus
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
                {label: "Active", value: "active", icon: CheckCircle2},
                {label: "Inactive", value: "inactive", icon: EyeOff},
                {label: "Deprecated", value: "deprecated", icon: Archive},
            ],
        },
        enableColumnFilter: true,
    },
    {
        id: "category",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Category"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {row.original.category?.name ?? "—"}
      </span>
        ),
    },
    {
        accessorKey: "default_limit_type",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Limit type"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {row.original.default_limit_type
            ? limitTypeLabels[row.original.default_limit_type] ??
            row.original.default_limit_type
            : "—"}
      </span>
        ),
    },
    {
        accessorKey: "is_available",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Available"/>
        ),
        cell: ({row}) =>
            row.original.is_available ? (
                <CheckCircle2 className="text-emerald-500 size-4"/>
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
        {row.original.created_at_human ??
            new Date(row.getValue("created_at")).toLocaleDateString()}
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
