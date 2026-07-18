"use client"

import {
  Building2Icon,
  CheckCircle2Icon,
  FlaskConicalIcon,
  PauseCircleIcon,
} from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { MetricCard } from "@/features/central/dashboard/components/metric-card"
import { formatCompactNumber } from "@/features/central/dashboard/lib/format"
import { useGetTenantStatistics } from "@/features/central/tenants/hooks/use-tenant-query"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"

export function TenantsStats() {
  const { data, isLoading, error } = useGetTenantStatistics()

  useQueryErrorToast(error ?? null, "Failed to load tenant statistics.")

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
        title="Total tenants"
        value={formatCompactNumber(data?.total ?? 0)}
        description="All organizations"
        icon={Building2Icon}
      />
      <MetricCard
        title="Active"
        value={formatCompactNumber(data?.active ?? 0)}
        description="Live on platform"
        icon={CheckCircle2Icon}
      />
      <MetricCard
        title="Trial"
        value={formatCompactNumber(data?.trial ?? 0)}
        description="Evaluation period"
        icon={FlaskConicalIcon}
      />
      <MetricCard
        title="Suspended"
        value={formatCompactNumber(data?.suspended ?? 0)}
        description="Access blocked"
        icon={PauseCircleIcon}
      />
    </div>
  )
}
