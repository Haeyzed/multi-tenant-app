"use client"

import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  RefreshCwIcon,
  SparklesIcon,
} from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { useGetSubscriptionStatistics } from "@/features/central/billing/subscriptions/hooks/use-subscription-query"
import { MetricCard } from "@/features/central/dashboard/components/metric-card"
import { formatCompactNumber } from "@/features/central/dashboard/lib/format"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"

export function SubscriptionsStats() {
  const { data, isLoading, error } = useGetSubscriptionStatistics()

  useQueryErrorToast(error ?? null, "Failed to load subscription statistics.")

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
        title="Total subscriptions"
        value={formatCompactNumber(data?.total ?? 0)}
        description="All subscriptions"
        icon={RefreshCwIcon}
      />
      <MetricCard
        title="Active"
        value={formatCompactNumber(data?.active ?? 0)}
        description="Currently billing"
        icon={CheckCircle2Icon}
      />
      <MetricCard
        title="Trialing"
        value={formatCompactNumber(data?.trialing ?? 0)}
        description="Evaluation period"
        icon={SparklesIcon}
      />
      <MetricCard
        title="Past due"
        value={formatCompactNumber(data?.past_due ?? 0)}
        description="Requires attention"
        icon={AlertTriangleIcon}
      />
    </div>
  )
}
