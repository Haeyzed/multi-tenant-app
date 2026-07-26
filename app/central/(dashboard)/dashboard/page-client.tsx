"use client"

import {Button} from '@/components/ui/button'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {ConfigDrawer} from '@/components/config-drawer'
import {Header} from '@/components/layout/header'
import {Main} from '@/components/layout/main'
import {Search} from '@/components/search'
import {ThemeSwitch} from '@/components/theme-switch'
import {CentralAuthGuard} from '@/features/central/auth/components/auth-guard'
import {PermissionGate} from '@/features/central/auth/components/permission-gate'
import {permissions} from '@/features/central/auth/permissions'
import {DashboardOverview} from '@/features/central/dashboard/components/dashboard-overview'
import {ProfileDropdown} from '@/features/central/shell/components/profile-dropdown'
import {LockIcon} from 'lucide-react'
import {TopNav} from "@/components/layout/top-nav";
import {DashboardActivitiesTab} from "@/features/central/dashboard/components/dashboard-activities-tab";

export default function DashboardPage() {
    return (
        <CentralAuthGuard permissions={[permissions.dashboard.view]}>
            <Header>
                <TopNav links={topNav} className='me-auto'/>
                <Search className="me-auto"/>
                <ThemeSwitch/>
                <ConfigDrawer/>
                <ProfileDropdown/>
            </Header>

            <Main>
                <div className="mb-2 flex items-center justify-between space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <div className="flex items-center space-x-2">
                        <PermissionGate
                            permissions={[permissions.audit.export]}
                            fallback={
                                <Button disabled variant="outline">
                                    <LockIcon className="mr-1.5 size-3.5"/>
                                    Download (Locked)
                                </Button>
                            }
                        >
                            <Button>Download</Button>
                        </PermissionGate>
                    </div>
                </div>

                {/* Removed orientation="vertical" here to restore horizontal layout */}
                <Tabs
                    defaultValue="overview"
                    className="space-y-4"
                >
                    <div className="w-full overflow-x-auto pb-2">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                            {/*<TabsTrigger value="reports" disabled>*/}
                            {/*  Reports*/}
                            {/*</TabsTrigger>*/}
                            {/*<TabsTrigger value="notifications" disabled>*/}
                            {/*  Notifications*/}
                            {/*</TabsTrigger>*/}
                        </TabsList>
                    </div>
                    <TabsContent value="overview">
                        <DashboardOverview/>
                    </TabsContent>
                    <TabsContent value="activity" className="space-y-4">
                        <DashboardActivitiesTab/>
                    </TabsContent>
                </Tabs>
            </Main>
        </CentralAuthGuard>
    )
}

const topNav = [
    {
        title: 'Overview',
        href: 'dashboard/overview',
        isActive: true,
        disabled: false,
    },
    {
        title: 'Customers',
        href: 'dashboard/customers',
        isActive: false,
        disabled: true,
    },
    {
        title: 'Products',
        href: 'dashboard/products',
        isActive: false,
        disabled: true,
    },
    {
        title: 'Settings',
        href: 'dashboard/settings',
        isActive: false,
        disabled: true,
    },
]