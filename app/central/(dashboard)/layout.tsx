"use client"

import {DashboardShell} from "@/components/layout/dashboard-shell"
import {CentralAuthGuard} from "@/features/central/auth/components/auth-guard"
import {AppSidebar} from "@/features/central/shell/app-sidebar"
import {CommandMenu} from "@/features/central/shell/command-menu"
import {CentralAuthProvider} from "@/lib/providers/central-auth-provider"

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return (
        <CentralAuthProvider>
            <DashboardShell
                sidebar={<AppSidebar/>}
                commandMenu={<CommandMenu/>}
            >
                <CentralAuthGuard>{children}</CentralAuthGuard>
            </DashboardShell>
        </CentralAuthProvider>
    )
}
