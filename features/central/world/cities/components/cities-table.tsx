"use client"

import * as React from "react"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs"

import { DataTable } from "@/components/data-table/data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { buildColumns } from "@/features/central/world/cities/components/cities-columns"
import {
  useCountrySelectOptions,
  useGetPaginatedCities,
  useStateSelectOptions,
} from "@/features/central/world/hooks/use-world-query"
import { useDataTable } from "@/hooks/use-data-table"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"

const COLUMN_COUNT = 5
const FILTER_COUNT = 3

export function CitiesTable() {
  const [name] = useQueryState("name", parseAsString.withDefault(""))
  const [stateId, setStateId] = useQueryState(
    "state_id",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [countryId] = useQueryState(
    "country_id",
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [page] = useQueryState("page", parseAsInteger.withDefault(1))
  const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

  const { data: countryOptions } = useCountrySelectOptions()
  const selectedCountryId = countryId[0] ? Number(countryId[0]) : undefined
  const { data: stateOptions } = useStateSelectOptions(selectedCountryId)
  const previousCountryId = React.useRef(selectedCountryId)

  React.useEffect(() => {
    if (previousCountryId.current !== selectedCountryId) {
      void setStateId([])
      previousCountryId.current = selectedCountryId
    }
  }, [selectedCountryId, setStateId])

  const { data, isLoading, error } = useGetPaginatedCities({
    search: name || undefined,
    state_id: stateId[0] ? Number(stateId[0]) : undefined,
    country_id: selectedCountryId,
    per_page: perPage,
    page,
  })

  useQueryErrorToast(error ?? null, "Failed to load cities.")

  const columns = React.useMemo(
    () =>
      buildColumns(
        countryOptions ?? [],
        stateOptions ?? [],
        selectedCountryId !== undefined
      ),
    [countryOptions, selectedCountryId, stateOptions]
  )

  const tableData = data?.data || []

  const { table } = useDataTable({
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
      columnPinning: { left: ["name"], right: ["actions"] },
      pagination: { pageIndex: 0, pageSize: perPage },
    },
    getRowId: (row) => String(row.id),
  })

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={COLUMN_COUNT}
        rowCount={perPage}
        filterCount={FILTER_COUNT}
        cellWidths={["auto", "10rem", "10rem", "6rem", "3rem"]}
      />
    )
  }

  return (
    <div className="data-table-container">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
