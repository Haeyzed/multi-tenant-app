"use client"

import {Button} from "@/components/ui/button"
import {
    ResponsiveDialog,
    ResponsiveDialogClose,
    ResponsiveDialogContent,
    ResponsiveDialogDescription,
    ResponsiveDialogFooter,
    ResponsiveDialogHeader,
    ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Skeleton} from "@/components/ui/skeleton"
import {formatRelativeTime} from "@/features/central/shared/lib/format"
import {useGetUserActivities} from "@/features/central/users/hooks/use-user-query"
import {useQueryErrorToast} from "@/hooks/use-query-error-toast"
import type {CentralUser} from "@/types/central/user"

type UsersActivitiesDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: CentralUser
}

export function UsersActivitiesDialog({
                                          open,
                                          onOpenChange,
                                          user,
                                      }: UsersActivitiesDialogProps) {
    const {data, isLoading, error} = useGetUserActivities(
        user.id,
        {per_page: 50},
        open
    )

    useQueryErrorToast(error ?? null, "Failed to load user activities.")

    const activities = data?.data ?? []

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>Activity history</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Recent audit events for {user.name}.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({length: 6}).map((_, index) => (
                            <Skeleton key={index} className="h-12 w-full"/>
                        ))}
                    </div>
                ) : !activities.length ? (
                    <p className="text-muted-foreground text-sm">No activity yet.</p>
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
                                        <p className="text-muted-foreground text-xs">
                                            {[activity.event, activity.log_name]
                                                .filter(Boolean)
                                                .join(" · ") || "activity"}
                                        </p>
                                    </div>
                                    <span className="text-muted-foreground shrink-0 text-xs">
                    {formatRelativeTime(activity.created_at)}
                  </span>
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                )}

                <ResponsiveDialogFooter>
                    <ResponsiveDialogClose
                        render={<Button variant="outline">Close</Button>}
                    />
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}
