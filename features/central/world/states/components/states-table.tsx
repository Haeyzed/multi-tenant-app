"use client"

import * as React from "react"
import {parseAsArrayOf, parseAsInteger, parseAsString, useQueryState,} from "nuqs"

import {DataTable} from "@/components/data-table/data-table"
import {DataTableSkeleton} from "@/components/data-table/data-table-skeleton"
import {DataTableToolbar} from "@/components/data-table/data-table-toolbar"
import {useCountrySelectOptions, useGetPaginatedStates,} from "@/features/central/world/hooks/use-world-query"
import {buildColumns} from "@/features/central/world/states/components/states-columns"
import {useDataTable} from "@/hooks/use-data-table"
import {useQueryErrorToast} from "@/hooks/use-query-error-toast"

const COLUMN_COUNT = 5
const FILTER_COUNT = 2

export function StatesTable() {
    const [name] = useQueryState("name", parseAsString.withDefault(""))
    const [countryId] = useQueryState(
        "country_id",
        parseAsArrayOf(parseAsString).withDefault([])
    )
    const [page] = useQueryState("page", parseAsInteger.withDefault(1))
    const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

    const {data: countryOptions} = useCountrySelectOptions()

    const {data, isLoading, error} = useGetPaginatedStates({
        search: name || undefined,
        country_id: countryId[0] ? Number(countryId[0]) : undefined,
        per_page: perPage,
        page,
    })

    useQueryErrorToast(error ?? null, "Failed to load states.")

    const columns = React.useMemo(
        () => buildColumns(countryOptions ?? []),
        [countryOptions]
    )

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
            columnPinning: {left: ["name"], right: ["actions"]},
            pagination: {pageIndex: 0, pageSize: perPage},
        },
        getRowId: (row) => String(row.id),
    })

    if (isLoading) {
        return (
            <DataTableSkeleton
                columnCount={COLUMN_COUNT}
                rowCount={perPage}
                filterCount={FILTER_COUNT}
                cellWidths={["auto", "6rem", "10rem", "8rem", "3rem"]}
            />
        )
    }

    return (
        <div className="data-table-container">
            <DataTable table={table}>
                <DataTableToolbar table={table}/>
            </DataTable>
        </div>
    )
}
