"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardCharts } from "@/types/central/dashboard"

const revenueConfig = {
  amount: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const tenantsConfig = {
  count: {
    label: "Tenants",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type DashboardChartsPanelProps = {
  data?: DashboardCharts
  isLoading: boolean
}

export function DashboardChartsPanel({
  data,
  isLoading,
}: DashboardChartsPanelProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Completed payment volume (30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueConfig} className="aspect-auto h-56 w-full">
            <AreaChart data={data?.revenue ?? []} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={28}
                tickFormatter={(value: string) =>
                  new Date(value).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                tickFormatter={(value: number) =>
                  new Intl.NumberFormat("en", {
                    notation: "compact",
                  }).format(value)
                }
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="amount"
                type="monotone"
                fill="var(--color-amount)"
                fillOpacity={0.2}
                stroke="var(--color-amount)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>New tenants</CardTitle>
          <CardDescription>Tenant signups (30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={tenantsConfig} className="aspect-auto h-56 w-full">
            <AreaChart data={data?.tenants ?? []} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={28}
                tickFormatter={(value: string) =>
                  new Date(value).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="count"
                type="monotone"
                fill="var(--color-count)"
                fillOpacity={0.2}
                stroke="var(--color-count)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
