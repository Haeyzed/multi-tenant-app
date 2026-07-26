"use client"

import {ConfigDrawer} from "@/components/config-drawer"
import {Header} from "@/components/layout/header"
import {Main} from "@/components/layout/main"
import {PageHeader} from "@/components/layout/page-header"
import {Search} from "@/components/search"
import {ThemeSwitch} from "@/components/theme-switch"
import {Separator} from "@/components/ui/separator"
import {CentralAuthGuard} from "@/features/central/auth/components/auth-guard"
import {permissions} from "@/features/central/auth/permissions"
import {SettingsSidebarNav} from "@/features/central/settings/components/settings-sidebar-nav"
import {ProfileDropdown} from "@/features/central/shell/components/profile-dropdown"

export default function SettingsLayout({
                                           children,
                                       }: {
    children: React.ReactNode
}) {
    return (
        <CentralAuthGuard permissions={permissions.settings.view}>
            <Header fixed>
                <Search className="me-auto"/>
                <ThemeSwitch/>
                <ConfigDrawer/>
                <ProfileDropdown/>
            </Header>

            <Main fixed>
                <PageHeader
                    title="Settings"
                    description="Configure platform-wide settings, including billing gateways and currencies."
                />
                <Separator className="my-4 lg:my-6"/>
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden md:gap-2 lg:flex-row lg:gap-12">
                    <aside className="top-0 min-h-0 shrink-0 lg:sticky lg:flex lg:h-full lg:w-1/5 lg:flex-col lg:overflow-hidden">
                        <SettingsSidebarNav/>
                    </aside>
                    <div className="flex min-h-0 w-full flex-1 overflow-hidden p-1">{children}</div>
                </div>
            </Main>
        </CentralAuthGuard>
    )
}
