"use client"

import {type ColumnDef} from "@tanstack/react-table"
import {Search} from "lucide-react"

import {DataTableColumnHeader} from "@/components/data-table/data-table-column-header"
import {DataTableRowActions} from "@/features/central/world/cities/components/cities-row-actions"
import type {City, CountryOption, StateOption} from "@/types/central/world"

export function buildColumns(
    countryOptions: CountryOption[],
    stateOptions: StateOption[],
    showStateFilter: boolean
): ColumnDef<City>[] {
    return [
        {
            id: "name",
            accessorKey: "name",
            header: ({column}) => (
                <DataTableColumnHeader column={column} label="Name"/>
            ),
            meta: {
                label: "Name",
                placeholder: "Search cities...",
                variant: "text",
                icon: Search,
            },
            enableColumnFilter: true,
            cell: ({cell}) => (
                <span className="truncate font-medium">{cell.getValue<string>()}</span>
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
          {row.original.country?.name ?? row.original.country_id}
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
            id: "state_id",
            accessorKey: "state_id",
            header: ({column}) => (
                <DataTableColumnHeader column={column} label="State"/>
            ),
            cell: ({row}) => (
                <span className="text-muted-foreground">
          {row.original.state?.name ?? row.original.state_id}
        </span>
            ),
            meta: {
                label: "State",
                placeholder: "Select state...",
                variant: "select",
                options: stateOptions,
            },
            enableColumnFilter: showStateFilter,
        },
        {
            accessorKey: "state_code",
            header: ({column}) => (
                <DataTableColumnHeader column={column} label="State code"/>
            ),
            cell: ({row}) => (
                <span className="text-muted-foreground">
          {(row.getValue("state_code") as string | null) || "—"}
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
}
