"use client"

import {
  LayersIcon,
  ListIcon,
  ShieldIcon,
} from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { MetricCard } from "@/features/central/dashboard/components/metric-card"
import { formatCompactNumber } from "@/features/central/dashboard/lib/format"
import { useGetPermissionStatistics } from "@/features/central/permissions/hooks/use-permission-query"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"

export function PermissionsStats() {
  const { data, isLoading, error } = useGetPermissionStatistics()

  useQueryErrorToast(error ?? null, "Failed to load permission statistics.")

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <MetricCard
        title="Total permissions"
        value={formatCompactNumber(data?.total ?? 0)}
        description="In the database"
        icon={ShieldIcon}
      />
      <MetricCard
        title="Groups"
        value={formatCompactNumber(data?.groups ?? 0)}
        description="Namespace prefixes"
        icon={LayersIcon}
      />
      <MetricCard
        title="Catalog"
        value={formatCompactNumber(data?.catalog_total ?? 0)}
        description="Defined in catalog"
        icon={ListIcon}
      />
    </div>
  )
}
