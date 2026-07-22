"use client"

import {parseAsInteger, useQueryState} from "nuqs"

import {DataTable} from "@/components/data-table/data-table"
import {DataTableSkeleton} from "@/components/data-table/data-table-skeleton"
import {columns} from "@/features/central/monitoring/components/failed-jobs-columns"
import {useGetFailedJobs} from "@/features/central/monitoring/hooks/use-monitoring-query"
import {useDataTable} from "@/hooks/use-data-table"
import {useQueryErrorToast} from "@/hooks/use-query-error-toast"

const COLUMN_COUNT = 6

export function FailedJobsTable() {
    const [page] = useQueryState("page", parseAsInteger.withDefault(1))
    const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(25))

    const {data, isLoading, error} = useGetFailedJobs({
        per_page: perPage,
        page,
    })

    useQueryErrorToast(error ?? null, "Failed to load failed jobs.")

    const tableData = data?.data || []

    const {table} = useDataTable({
        data: tableData,
        columns,
        pageCount: data?.meta?.last_page || 1,
        queryKeys: {
            page: "page",
            perPage: "per_page",
            sort: "sort",
            filters: "filters",
            joinOperator: "joinOperator",
        },
        initialState: {
            sorting: [{id: "failed_at", desc: true}],
            columnPinning: {left: ["id"], right: ["actions"]},
            pagination: {pageIndex: page - 1, pageSize: perPage},
        },
        getRowId: (row) => String(row.id),
    })

    if (isLoading) {
        return (
            <DataTableSkeleton
                columnCount={COLUMN_COUNT}
                rowCount={perPage}
                filterCount={0}
                cellWidths={["8rem", "8rem", "8rem", "18rem", "8rem", "3rem"]}
            />
        )
    }

    return (
        <div className="data-table-container space-y-4">
            <DataTable table={table}/>
        </div>
    )
}
