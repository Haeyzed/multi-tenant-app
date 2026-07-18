"use client"

import {
  CheckCircle2Icon,
  CreditCardIcon,
  RotateCcwIcon,
  XCircleIcon,
} from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { useGetPaymentStatistics } from "@/features/central/billing/payments/hooks/use-payment-query"
import { MetricCard } from "@/features/central/dashboard/components/metric-card"
import {
  formatCompactNumber,
  formatMoney,
} from "@/features/central/dashboard/lib/format"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"

export function PaymentsStats() {
  const { data, isLoading, error } = useGetPaymentStatistics()

  useQueryErrorToast(error ?? null, "Failed to load payment statistics.")

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Total payments"
        value={formatCompactNumber(data?.total ?? 0)}
        description="All transactions"
        icon={CreditCardIcon}
      />
      <MetricCard
        title="Completed"
        value={formatCompactNumber(data?.completed ?? 0)}
        description="Successful charges"
        icon={CheckCircle2Icon}
      />
      <MetricCard
        title="Failed"
        value={formatCompactNumber(data?.failed ?? 0)}
        description="Declined charges"
        icon={XCircleIcon}
      />
      <MetricCard
        title="Collected volume"
        value={formatMoney(data?.volume ?? 0)}
        description="Completed payments"
        icon={RotateCcwIcon}
      />
    </div>
  )
}
