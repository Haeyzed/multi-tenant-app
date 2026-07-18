import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  getPayment,
  getPayments,
  getPaymentStatistics,
  refundPayment,
} from "@/lib/services/central/payment-service"

export const paymentsQueryKey = (params?: Record<string, unknown>) =>
  ["central", "payments", params ?? {}] as const

export const paymentQueryKey = (id: number) =>
  ["central", "payments", id] as const

export const paymentStatisticsQueryKey = () =>
  ["central", "payments", "statistics"] as const

function invalidatePaymentQueries(
  queryClient: ReturnType<typeof useQueryClient>
) {
  queryClient.invalidateQueries({ queryKey: ["central", "payments"] })
}

export function useGetPayments(params?: {
  tenant_id?: string
  status?: string
  gateway?: string
  search?: string
  per_page?: number
  page?: number
}) {
  return useQuery({
    queryKey: paymentsQueryKey(params),
    queryFn: () => getPayments(params),
  })
}

export function useGetPaymentStatistics() {
  return useQuery({
    queryKey: paymentStatisticsQueryKey(),
    queryFn: getPaymentStatistics,
  })
}

export function useGetPayment(id: number, enabled = true) {
  return useQuery({
    queryKey: paymentQueryKey(id),
    queryFn: () => getPayment(id),
    enabled,
  })
}

export function useRefundPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number
      values?: { amount?: number; reason?: string }
    }) => refundPayment(id, values),
    onSuccess: () => invalidatePaymentQueries(queryClient),
  })
}
