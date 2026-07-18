"use client"

import { RefreshCwIcon, Trash2Icon } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { useMonitoring } from "@/features/central/monitoring/components/monitoring-provider"
import { monitoringQueryKey } from "@/features/central/monitoring/hooks/use-monitoring-query"

export function MonitoringPrimaryButtons() {
  const queryClient = useQueryClient()
  const { setOpen } = useMonitoring()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        className="gap-1"
        onClick={() => {
          queryClient.invalidateQueries({ queryKey: monitoringQueryKey })
        }}
      >
        <RefreshCwIcon className="size-4" />
        <span>Refresh</span>
      </Button>
      <PermissionGate permissions="monitoring.manage">
        <Button
          variant="destructive"
          className="gap-1"
          onClick={() => setOpen("flush")}
        >
          <Trash2Icon className="size-4" />
          <span>Flush failed jobs</span>
        </Button>
      </PermissionGate>
    </div>
  )
}
