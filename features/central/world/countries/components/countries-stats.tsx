"use client"

import {
  CheckCircle2Icon,
  GlobeIcon,
  MapIcon,
  XCircleIcon,
} from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { MetricCard } from "@/features/central/dashboard/components/metric-card"
import { formatCompactNumber } from "@/features/central/dashboard/lib/format"
import { useWorldStatistics } from "@/features/central/world/hooks/use-world-query"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"

export function CountriesStats() {
  const { data, isLoading, error } = useWorldStatistics()

  useQueryErrorToast(error ?? null, "Failed to load world statistics.")

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
        title="Countries"
        value={formatCompactNumber(data?.countries ?? 0)}
        description="All countries"
        icon={GlobeIcon}
      />
      <MetricCard
        title="Active"
        value={formatCompactNumber(data?.active_countries ?? 0)}
        description="Enabled for lookups"
        icon={CheckCircle2Icon}
      />
      <MetricCard
        title="Inactive"
        value={formatCompactNumber(data?.inactive_countries ?? 0)}
        description="Hidden from lookups"
        icon={XCircleIcon}
      />
      <MetricCard
        title="States"
        value={formatCompactNumber(data?.states ?? 0)}
        description="Across all countries"
        icon={MapIcon}
      />
    </div>
  )
}
