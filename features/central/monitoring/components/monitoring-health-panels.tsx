"use client"

import {
  DatabaseIcon,
  HardDriveIcon,
  MemoryStickIcon,
  ServerIcon,
  WifiIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatBytes } from "@/hooks/use-file-upload"
import { useGetMonitoringOverview } from "@/features/central/monitoring/hooks/use-monitoring-query"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"
import type { MonitoringStatus } from "@/types/central/monitoring"

function statusVariant(status?: MonitoringStatus | boolean) {
  if (status === true || status === "healthy") {
    return "secondary" as const
  }

  if (
    status === false ||
    status === "critical" ||
    status === "down" ||
    status === "degraded"
  ) {
    return "destructive" as const
  }

  return "outline" as const
}

function HealthRow({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b pb-2 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-end font-medium">{value ?? "—"}</span>
    </div>
  )
}

export function MonitoringHealthPanels() {
  const { data, isLoading, error } = useGetMonitoringOverview()

  useQueryErrorToast(error ?? null, "Failed to load health checks.")

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-56 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DatabaseIcon className="size-4" />
              Database
            </CardTitle>
            <CardDescription>Connection and latency</CardDescription>
          </div>
          <Badge variant={statusVariant(data?.database.ok)}>
            {data?.database.ok ? "ok" : "fail"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <HealthRow label="Driver" value={data?.database.driver} />
          <HealthRow
            label="Latency"
            value={
              data?.database.latency_ms
                ? `${data.database.latency_ms}ms`
                : data?.database.message
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MemoryStickIcon className="size-4" />
              Cache
            </CardTitle>
            <CardDescription>Cache store availability</CardDescription>
          </div>
          <Badge variant={statusVariant(data?.cache.ok)}>
            {data?.cache.ok ? "ok" : "fail"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <HealthRow label="Driver" value={data?.cache.driver} />
          <HealthRow label="Message" value={data?.cache.message} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ServerIcon className="size-4" />
              Queue
            </CardTitle>
            <CardDescription>Pending and failed jobs</CardDescription>
          </div>
          <Badge variant={statusVariant(data?.queue.status)}>
            {data?.queue.status ?? "unknown"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <HealthRow label="Connection" value={data?.queue.connection} />
          <HealthRow label="Pending jobs" value={data?.queue.pending_jobs} />
          <HealthRow label="Failed jobs" value={data?.queue.failed_jobs} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <HardDriveIcon className="size-4" />
              Storage
            </CardTitle>
            <CardDescription>Writable disk and capacity</CardDescription>
          </div>
          <Badge variant={statusVariant(data?.storage.ok)}>
            {data?.storage.ok ? "ok" : "fail"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <HealthRow
            label="Writable"
            value={data?.storage.writable ? "Yes" : "No"}
          />
          <HealthRow
            label="Free space"
            value={
              data?.storage.free_bytes
                ? formatBytes(data.storage.free_bytes)
                : "—"
            }
          />
          <HealthRow
            label="Total space"
            value={
              data?.storage.total_bytes
                ? formatBytes(data.storage.total_bytes)
                : "—"
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <WifiIcon className="size-4" />
              Redis
            </CardTitle>
            <CardDescription>Redis connection probe</CardDescription>
          </div>
          <Badge variant={statusVariant(data?.redis.ok)}>
            {data?.redis.ok ? "ok" : "fail"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <HealthRow
            label="Configured"
            value={data?.redis.configured ? "Yes" : "No"}
          />
          <HealthRow label="Message" value={data?.redis.message} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ServerIcon className="size-4" />
              Server
            </CardTitle>
            <CardDescription>Runtime environment</CardDescription>
          </div>
          <Badge variant={data?.server.debug ? "destructive" : "secondary"}>
            {data?.server.environment ?? "unknown"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <HealthRow label="PHP" value={data?.server.php_version} />
          <HealthRow label="Laravel" value={data?.server.laravel_version} />
          <HealthRow label="Timezone" value={data?.server.timezone} />
          <HealthRow
            label="Memory usage"
            value={
              data?.server.memory_usage_bytes
                ? formatBytes(data.server.memory_usage_bytes)
                : "—"
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
