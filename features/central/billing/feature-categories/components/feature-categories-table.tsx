"use client"

import * as React from "react"
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {DataTable} from "@/components/data-table/data-table"
import {DataTableSkeleton} from "@/components/data-table/data-table-skeleton"
import {DataTableToolbar} from "@/components/data-table/data-table-toolbar"
import {columns} from "@/features/central/billing/feature-categories/components/feature-categories-columns"
import {useGetFeatureCategories} from "@/features/central/billing/feature-categories/hooks/use-feature-category-query"
import {useQueryErrorToast} from "@/hooks/use-query-error-toast"

const COLUMN_COUNT = 6
const FILTER_COUNT = 1

export function FeatureCategoriesTable() {
    const {data, isLoading, error} = useGetFeatureCategories()

    useQueryErrorToast(error ?? null, "Failed to load feature categories.")

    const tableData = React.useMemo(() => data ?? [], [data])

    const table = useReactTable({
        data: tableData,
        columns,
        getRowId: (row) => String(row.id),
        initialState: {
            sorting: [{id: "sort_order", desc: false}],
            pagination: {pageIndex: 0, pageSize: 15},
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    if (isLoading) {
        return (
            <DataTableSkeleton
                columnCount={COLUMN_COUNT}
                rowCount={10}
                filterCount={FILTER_COUNT}
                cellWidths={["auto", "8rem", "6rem", "6rem", "8rem", "3rem"]}
            />
        )
    }

    return (
        <div className="data-table-container space-y-4">
            <DataTable table={table}>
                <DataTableToolbar table={table}/>
            </DataTable>
        </div>
    )
}
