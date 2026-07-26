import {useQuery} from "@tanstack/react-query"

import {
    getDashboardActivities,
    getDashboardCharts,
    getDashboardOverview,
} from "@/lib/services/central/dashboard-service"

export const dashboardOverviewQueryKey = ["central", "dashboard", "overview"] as const
export const dashboardChartsQueryKey = (
    days: number
) => ["central", "dashboard", "charts", days] as const
export const dashboardActivitiesQueryKey = (
    limit: number
) => ["central", "dashboard", "activities", limit] as const

export function useDashboardOverview() {
    return useQuery({
        queryKey: dashboardOverviewQueryKey,
        queryFn: ({signal}) => getDashboardOverview(signal),
        staleTime: 30_000,
    })
}

export function useDashboardCharts(days = 30) {
    return useQuery({
        queryKey: dashboardChartsQueryKey(days),
        queryFn: ({signal}) => getDashboardCharts(days, signal),
        staleTime: 60_000,
    })
}

export function useDashboardActivities(limit = 15) {
    return useQuery({
        queryKey: dashboardActivitiesQueryKey(limit),
        queryFn: ({signal}) => getDashboardActivities(limit, signal),
        staleTime: 30_000,
    })
}
