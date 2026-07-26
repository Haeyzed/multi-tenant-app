"use client"

import {type ColumnDef} from "@tanstack/react-table"
import {Search} from "lucide-react"

import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header"
import {DataTableRowActions} from "@/features/central/world/currencies/components/currencies-row-actions"
import type {CountryOption, Currency} from "@/features/central/world/types"

export function buildColumns(
    countryOptions: CountryOption[]
): ColumnDef<Currency>[] {
    return [
        {
            id: "name",
            accessorKey: "name",
            header: ({column}) => (
                <DataTableColumnHeader column={column} label="Name"/>
            ),
            meta: {
                label: "Name",
                placeholder: "Search currencies...",
                variant: "text",
                icon: Search,
            },
            enableColumnFilter: true,
            cell: ({cell}) => (
                <span className="truncate font-medium">{cell.getValue<string>()}</span>
            ),
        },
        {
            accessorKey: "code",
            header: ({column}) => (
                <DataTableColumnHeader column={column} label="Code"/>
            ),
            cell: ({row}) => (
                <span className="text-muted-foreground">{row.getValue("code")}</span>
            ),
        },
        {
            accessorKey: "symbol",
            header: ({column}) => (
                <DataTableColumnHeader column={column} label="Symbol"/>
            ),
            cell: ({row}) => (
                <span className="text-muted-foreground">
          {(row.getValue("symbol") as string | null) || "—"}
        </span>
            ),
        },
        {
            accessorKey: "precision",
            header: ({column}) => (
                <DataTableColumnHeader column={column} label="Precision"/>
            ),
            cell: ({row}) => (
                <span className="text-muted-foreground">
          {row.original.precision ?? "—"}
        </span>
            ),
        },
        {
            id: "country_id",
            accessorKey: "country_id",
            header: ({column}) => (
                <DataTableColumnHeader column={column} label="Country"/>
            ),
            cell: ({row}) => (
                <span className="text-muted-foreground">
          {row.original.country?.name ?? row.original.country_id ?? "—"}
        </span>
            ),
            meta: {
                label: "Country",
                variant: "select",
                options: countryOptions,
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
}
