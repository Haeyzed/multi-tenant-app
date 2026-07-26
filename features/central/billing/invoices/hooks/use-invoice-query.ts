import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"

import type {StoreInvoiceFormValues} from "@/features/central/billing/invoices/schemas"
import {
    chargeInvoice,
    createInvoice,
    getInvoice,
    getInvoices,
    getInvoiceStatistics,
    sendInvoicePaymentLink,
    voidInvoice,
} from "@/lib/services/central/invoice-service"
import {listQueryOptions} from "@/lib/query/query-options"

export const invoicesQueryKey = (params?: Record<string, unknown>) =>
    ["central", "invoices", params ?? {}] as const

export const invoiceQueryKey = (id: number) =>
    ["central", "invoices", id] as const

export const invoiceStatisticsQueryKey = () =>
    ["central", "invoices", "statistics"] as const

function invalidateInvoiceQueries(
    queryClient: ReturnType<typeof useQueryClient>
) {
    queryClient.invalidateQueries({queryKey: ["central", "invoices"]})
}

export function useGetInvoices(params?: {
    tenant_id?: string
    status?: string
    subscription_id?: number
    search?: string
    per_page?: number
    page?: number
}) {
    return useQuery({
        queryKey: invoicesQueryKey(params),
        queryFn: ({signal}) => getInvoices(params, signal),
        ...listQueryOptions,
    })
}

export function useGetInvoiceStatistics() {
    return useQuery({
        queryKey: invoiceStatisticsQueryKey(),
        queryFn: getInvoiceStatistics,
    })
}

export function useGetInvoice(id: number, enabled = true) {
    return useQuery({
        queryKey: invoiceQueryKey(id),
        queryFn: () => getInvoice(id),
        enabled,
    })
}

export function useCreateInvoice() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (values: StoreInvoiceFormValues) => createInvoice(values),
        onSuccess: () => invalidateInvoiceQueries(queryClient),
    })
}

export function useVoidInvoice() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => voidInvoice(id),
        onSuccess: () => invalidateInvoiceQueries(queryClient),
    })
}

export function useChargeInvoice() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
                         id,
                         values,
                     }: {
            id: number
            values?: { gateway?: string; amount?: number }
        }) => chargeInvoice(id, values),
        onSuccess: () => {
            invalidateInvoiceQueries(queryClient)
            queryClient.invalidateQueries({queryKey: ["central", "payments"]})
        },
    })
}

export function useSendInvoicePaymentLink() {
    return useMutation({
        mutationFn: ({
                         id,
                         values,
                     }: {
            id: number
            values?: { email?: string }
        }) => sendInvoicePaymentLink(id, values),
    })
}
