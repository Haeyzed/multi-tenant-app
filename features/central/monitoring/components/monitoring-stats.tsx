"use client"

import {ActivityIcon, DatabaseIcon, HardDriveIcon, ServerIcon,} from "lucide-react"

import {Skeleton} from "@/components/ui/skeleton"
import {MetricCard} from "@/features/central/dashboard/components/metric-card"
import {formatCompactNumber} from "@/features/central/dashboard/lib/format"
import {useGetMonitoringOverview} from "@/features/central/monitoring/hooks/use-monitoring-query"
import {useQueryErrorToast} from "@/hooks/use-query-error-toast"

export function MonitoringStats() {
    const {data, isLoading, error} = useGetMonitoringOverview()

    useQueryErrorToast(error ?? null, "Failed to load monitoring overview.")

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({length: 4}).map((_, index) => (
                    <Skeleton key={index} className="h-32 rounded-xl"/>
                ))}
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
                title="Platform status"
                value={data?.status ?? "unknown"}
                description={
                    data?.checked_at
                        ? `Checked ${new Date(data.checked_at).toLocaleString()}`
                        : "Monitoring overview"
                }
                trend={data?.status === "healthy" ? "Healthy" : "Needs attention"}
                trendPositive={data?.status === "healthy"}
                icon={ActivityIcon}
            />
            <MetricCard
                title="Pending jobs"
                value={formatCompactNumber(data?.queue.pending_jobs ?? 0)}
                description={`Queue connection: ${data?.queue.connection ?? "—"}`}
                icon={ServerIcon}
            />
            <MetricCard
                title="Failed jobs"
                value={formatCompactNumber(data?.failed_jobs.count ?? 0)}
                description={`Queue status: ${data?.queue.status ?? "unknown"}`}
                trend={(data?.failed_jobs.count ?? 0) > 0 ? "Action needed" : "Clear"}
                trendPositive={(data?.failed_jobs.count ?? 0) === 0}
                icon={HardDriveIcon}
            />
            <MetricCard
                title="Database"
                value={data?.database.ok ? "Online" : "Offline"}
                description={
                    data?.database.latency_ms !== undefined
                        ? `${data.database.latency_ms}ms latency`
                        : (data?.database.message ?? "Database health")
                }
                trend={data?.database.ok ? "OK" : "Fail"}
                trendPositive={data?.database.ok}
                icon={DatabaseIcon}
            />
        </div>
    )
}
