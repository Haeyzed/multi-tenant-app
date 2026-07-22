"use client"

import {Building2Icon, CreditCardIcon, TrendingUpIcon, UsersIcon,} from "lucide-react"

import {Skeleton} from "@/components/ui/skeleton"
import {DashboardChartsPanel} from "@/features/central/dashboard/components/dashboard-charts"
import {MetricCard} from "@/features/central/dashboard/components/metric-card"
import {PlatformHealthCard} from "@/features/central/dashboard/components/platform-health"
import {useDashboardCharts, useDashboardOverview,} from "@/features/central/dashboard/hooks/use-dashboard-query"
import {formatCompactNumber, formatMoney, formatPercent,} from "@/features/central/dashboard/lib/format"
import {useQueryErrorToast} from "@/hooks/use-query-error-toast"

export function DashboardOverview() {
    const overviewQuery = useDashboardOverview()
    const chartsQuery = useDashboardCharts(30)

    useQueryErrorToast(overviewQuery.error ?? null)
    useQueryErrorToast(chartsQuery.error ?? null)

    const overview = overviewQuery.data
    const currency = overview?.revenue.currency ?? "NGN"
    const period = overview?.growth.period_days ?? 30

    return (
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
            {overviewQuery.isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {Array.from({length: 4}).map((_, index) => (
                        <Skeleton key={index} className="h-32 rounded-xl"/>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <MetricCard
                        title="Tenants"
                        value={formatCompactNumber(overview?.statistics.tenants.total ?? 0)}
                        description={`vs prior ${period}d`}
                        trend={formatPercent(overview?.growth.tenants.change_percent ?? 0)}
                        trendPositive={(overview?.growth.tenants.change_percent ?? 0) >= 0}
                        icon={Building2Icon}
                    />
                    <MetricCard
                        title="Active subscriptions"
                        value={formatCompactNumber(
                            overview?.statistics.subscriptions.active ?? 0
                        )}
                        description={`${overview?.statistics.subscriptions.trialing ?? 0} trialing · ${overview?.statistics.subscriptions.past_due ?? 0} past due`}
                        icon={CreditCardIcon}
                    />
                    <MetricCard
                        title="MRR"
                        value={formatMoney(overview?.revenue.mrr ?? 0, currency)}
                        description={`ARR ${formatMoney(overview?.revenue.arr ?? 0, currency)}`}
                        trend={formatPercent(overview?.growth.revenue.change_percent ?? 0)}
                        trendPositive={(overview?.growth.revenue.change_percent ?? 0) >= 0}
                        icon={TrendingUpIcon}
                    />
                    <MetricCard
                        title="Central users"
                        value={formatCompactNumber(overview?.statistics.users.total ?? 0)}
                        description={`${formatCompactNumber(overview?.statistics.payments.completed ?? 0)} completed payments`}
                        icon={UsersIcon}
                    />
                </div>
            )}

            <div className="grid gap-4 xl:grid-cols-3">
                <div className="space-y-4 xl:col-span-2">
                    <DashboardChartsPanel
                        data={chartsQuery.data}
                        isLoading={chartsQuery.isLoading}
                    />
                </div>
                <div className="space-y-4">
                    <PlatformHealthCard
                        health={overview?.platform_health}
                        isLoading={overviewQuery.isLoading}
                    />
                </div>
            </div>
        </div>
    )
}