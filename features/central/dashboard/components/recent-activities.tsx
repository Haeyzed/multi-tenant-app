"use client"

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Skeleton} from "@/components/ui/skeleton"
import {formatRelativeTime} from "@/features/central/shared/lib/format"
import type {DashboardActivity} from "@/features/central/dashboard/types"

type RecentActivitiesProps = {
    activities?: DashboardActivity[]
    isLoading: boolean
}

export function RecentActivities({
                                     activities,
                                     isLoading,
                                 }: RecentActivitiesProps) {
    return (
        <Card className="flex h-full min-h-0 flex-col">
            <CardHeader className="shrink-0">
                <CardTitle>Recent activity</CardTitle>
                <CardDescription>Latest platform audit events</CardDescription>
            </CardHeader>
            <CardContent className="min-h-0 flex-1">
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({length: 6}).map((_, index) => (
                            <Skeleton key={index} className="h-12 w-full"/>
                        ))}
                    </div>
                ) : !activities?.length ? (
                    <p className="text-sm text-muted-foreground">No recent activity yet.</p>
                ) : (
                    <ScrollArea className="h-88 pe-3">
                        <ul className="space-y-4">
                            {activities.map((activity) => (
                                <li
                                    key={activity.id}
                                    className="flex items-start justify-between gap-3 border-b pb-3 last:border-b-0 last:pb-0"
                                >
                                    <div className="min-w-0 space-y-1">
                                        <p className="truncate text-sm font-medium">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {[activity.event, activity.log_name]
                                                .filter(Boolean)
                                                .join(" · ") || "activity"}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelativeTime(activity.created_at)}
                  </span>
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    )
}
