"use client"

import {type ColumnDef} from "@tanstack/react-table"

import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header"
import {Badge} from "@/components/ui/badge"
import {DataTableRowActions} from "@/features/central/monitoring/components/data-table-row-actions"
import {formatRelativeTime} from "@/features/central/dashboard/lib/format"
import type {FailedJob} from "@/types/central/monitoring"

export const columns: ColumnDef<FailedJob>[] = [
    {
        id: "id",
        accessorKey: "id",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Job"/>
        ),
        cell: ({row}) => (
            <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">#{row.original.id}</span>
                <span className="truncate text-xs text-muted-foreground">
          {row.original.uuid || "—"}
        </span>
            </div>
        ),
    },
    {
        accessorKey: "connection",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Connection"/>
        ),
        cell: ({row}) => (
            <Badge variant="outline">{row.original.connection || "—"}</Badge>
        ),
    },
    {
        accessorKey: "queue",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Queue"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">{row.original.queue || "—"}</span>
        ),
    },
    {
        accessorKey: "exception",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Exception"/>
        ),
        cell: ({row}) => (
            <span className="line-clamp-2 max-w-xl text-muted-foreground">
        {row.original.exception || "—"}
      </span>
        ),
    },
    {
        accessorKey: "failed_at",
        header: ({column}) => (
            <DataTableColumnHeader column={column} label="Failed"/>
        ),
        cell: ({row}) => (
            <span className="text-muted-foreground">
        {formatRelativeTime(row.original.failed_at)}
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
