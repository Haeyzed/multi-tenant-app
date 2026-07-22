import {type LucideIcon} from "lucide-react"

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {cn} from "@/lib/utils"

type MetricCardProps = {
    title: string
    value: string
    description?: string
    trend?: string
    trendPositive?: boolean
    icon?: LucideIcon
    className?: string
}

export function MetricCard({
                               title,
                               value,
                               description,
                               trend,
                               trendPositive,
                               icon: Icon,
                               className,
                           }: MetricCardProps) {
    return (
        <Card className={cn(className)}>
            <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div className="space-y-1">
                    <CardDescription>{title}</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums">
                        {value}
                    </CardTitle>
                </div>
                {Icon ? (
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="size-4"/>
                    </div>
                ) : null}
            </CardHeader>
            {(description || trend) && (
                <CardContent className="text-xs text-muted-foreground">
                    {trend ? (
                        <p
                            className={cn(
                                "font-medium",
                                trendPositive === true && "text-emerald-600 dark:text-emerald-400",
                                trendPositive === false && "text-destructive"
                            )}
                        >
                            {trend}
                            {description ? (
                                <span className="font-normal text-muted-foreground">
                  {" "}
                                    {description}
                </span>
                            ) : null}
                        </p>
                    ) : (
                        <p>{description}</p>
                    )}
                </CardContent>
            )}
        </Card>
    )
}
