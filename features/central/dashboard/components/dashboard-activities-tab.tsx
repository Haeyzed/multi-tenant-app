"use client"

import {RecentActivities} from "@/features/central/dashboard/components/recent-activities"
import {useDashboardActivities} from "@/features/central/dashboard/hooks/use-dashboard-query"
import {useQueryErrorToast} from "@/hooks/use-query-error-toast"

export function DashboardActivitiesTab() {
    // Increase the limit since it has a whole page now, instead of just 12
    const activitiesQuery = useDashboardActivities(50)

    useQueryErrorToast(activitiesQuery.error ?? null)

    return (
        <div className="flex-1">
            <RecentActivities
                activities={activitiesQuery.data}
                isLoading={activitiesQuery.isLoading}
            />
        </div>
    )
}