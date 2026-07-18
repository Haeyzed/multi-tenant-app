"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { PlatformHealth } from "@/types/central/dashboard"

type PlatformHealthCardProps = {
  health?: PlatformHealth
  isLoading: boolean
}

export function PlatformHealthCard({
  health,
  isLoading,
}: PlatformHealthCardProps) {
  if (isLoading) {
    return <Skeleton className="h-48 rounded-xl" />
  }

  const checks = health
    ? Object.entries(health.checks)
    : ([] as Array<[string, { ok: boolean; message: string }]>)

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle>Platform health</CardTitle>
          <CardDescription>
            {health?.checked_at
              ? `Checked ${new Date(health.checked_at).toLocaleString()}`
              : "Infrastructure status"}
          </CardDescription>
        </div>
        <Badge
          variant={health?.status === "healthy" ? "secondary" : "destructive"}
        >
          {health?.status ?? "unknown"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {checks.map(([name, check]) => (
          <div
            key={name}
            className="flex items-start justify-between gap-3 rounded-lg border px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium capitalize">{name}</p>
              <p className="text-xs text-muted-foreground">{check.message}</p>
            </div>
            <Badge variant={check.ok ? "secondary" : "destructive"}>
              {check.ok ? "ok" : "fail"}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
