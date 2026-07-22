"use client"

import {LockIcon} from "lucide-react"
import {parseAsArrayOf, parseAsInteger, parseAsString, useQueryState,} from "nuqs"

import {DataTable} from "@/components/data-table/data-table"
import {DataTableSkeleton} from "@/components/data-table/data-table-skeleton"
import {DataTableToolbar} from "@/components/data-table/data-table-toolbar"
import {PermissionGate} from "@/features/central/auth/components/permission-gate"
import {permissions} from "@/features/central/auth/components/permissions"
import {TenantsBulkActions} from "@/features/central/tenants/components/tenants-bulk-actions"
import {columns} from "@/features/central/tenants/components/tenants-columns"
import {useGetTenants} from "@/features/central/tenants/hooks/use-tenant-query"
import {useDataTable} from "@/hooks/use-data-table"
import {useQueryErrorToast} from "@/hooks/use-query-error-toast"

const COLUMN_COUNT = 10
const FILTER_COUNT = 2

export function TenantsTable() {
    const [name] = useQueryState("name", parseAsString.withDefault(""))
    const [status] = useQueryState(
        "status",
        parseAsArrayOf(parseAsString).withDefault([])
    )
    const [page] = useQueryState("page", parseAsInteger.withDefault(1))
    const [perPage] = useQueryState("per_page", parseAsInteger.withDefault(15))

    const {data, isLoading, error} = useGetTenants({
        search: name || undefined,
        status: status[0] || undefined,
        per_page: perPage,
        page,
    })

    useQueryErrorToast(error ?? null, "Failed to load tenants.")

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
            sorting: [{id: "created_at", desc: true}],
            columnPinning: {left: ["select", "name"], right: ["actions"]},
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
                cellWidths={[
                    "auto",
                    "10rem",
                    "8rem",
                    "12rem",
                    "8rem",
                    "8rem",
                    "6rem",
                    "8rem",
                    "8rem",
                    "3rem",
                ]}
            />
        )
    }

    return (
        <PermissionGate
            permissions={[permissions.tenants.view]}
            fallback={
                <div
                    className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
                    <LockIcon className="text-muted-foreground mb-2 size-8"/>
                    <h3 className="font-semibold">Access Restricted</h3>
                    <p className="text-muted-foreground text-sm">
                        You do not have permission to view the tenants data directory.
                    </p>
                </div>
            }
        >
            <div className="data-table-container space-y-4">
                <DataTable
                    table={table}
                    actionBar={<TenantsBulkActions table={table}/>}
                >
                    <DataTableToolbar table={table}/>
                </DataTable>
            </div>
        </PermissionGate>
    )
}