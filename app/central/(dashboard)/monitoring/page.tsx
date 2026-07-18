"use client"

import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CentralAuthGuard } from "@/features/central/auth/components/auth-guard"
import { FailedJobsDialogs } from "@/features/central/monitoring/components/failed-jobs-dialogs"
import { FailedJobsTable } from "@/features/central/monitoring/components/failed-jobs-table"
import { MonitoringHealthPanels } from "@/features/central/monitoring/components/monitoring-health-panels"
import { MonitoringPrimaryButtons } from "@/features/central/monitoring/components/monitoring-primary-buttons"
import { MonitoringProvider } from "@/features/central/monitoring/components/monitoring-provider"
import { MonitoringStats } from "@/features/central/monitoring/components/monitoring-stats"

export default function MonitoringPage() {
  return (
    <CentralAuthGuard permissions="monitoring.view">
      <MonitoringProvider>
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">
          <PageHeader
            title="Monitoring"
            description="Monitor platform health, queues, infrastructure checks, and failed jobs."
          >
            <MonitoringPrimaryButtons />
          </PageHeader>
          <MonitoringStats />
          <MonitoringHealthPanels />
          <Card>
            <CardHeader>
              <CardTitle>Failed jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <FailedJobsTable />
            </CardContent>
          </Card>
          <FailedJobsDialogs />
        </div>
      </MonitoringProvider>
    </CentralAuthGuard>
  )
}
