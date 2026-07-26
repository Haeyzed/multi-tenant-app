"use client"

import {PageHeader} from "@/components/layout/page-header"
import {CentralAuthGuard} from "@/features/central/auth/components/auth-guard"
import {SubscriptionsDialogs} from "@/features/central/billing/subscriptions/components/subscriptions-dialogs"
import {
    SubscriptionsPrimaryButtons
} from "@/features/central/billing/subscriptions/components/subscriptions-primary-buttons"
import {SubscriptionsProvider} from "@/features/central/billing/subscriptions/components/subscriptions-provider"
import {SubscriptionsStats} from "@/features/central/billing/subscriptions/components/subscriptions-stats"
import {SubscriptionsTable} from "@/features/central/billing/subscriptions/components/subscriptions-table"
import {permissions} from "@/features/central/auth/permissions"
import {Header} from "@/components/layout/header"
import {ThemeSwitch} from "@/components/theme-switch"
import {ConfigDrawer} from "@/components/config-drawer"
import {Main} from "@/components/layout/main"
import {Search} from "@/components/search"
import {ProfileDropdown} from "@/features/central/shell/components/profile-dropdown"

export default function SubscriptionsPage() {
    return (
        <CentralAuthGuard permissions={permissions.subscriptions.view}>
            <SubscriptionsProvider>
                <Header fixed>
                    <Search className="me-auto"/>
                    <ThemeSwitch/>
                    <ConfigDrawer/>
                    <ProfileDropdown/>
                </Header>
                <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
                    <PageHeader
                        title="Subscriptions"
                        description="Manage tenant subscription lifecycles."
                    >
                        <SubscriptionsPrimaryButtons/>
                    </PageHeader>
                    <SubscriptionsStats/>
                    <SubscriptionsTable/>
                    <SubscriptionsDialogs/>
                </Main>
            </SubscriptionsProvider>
        </CentralAuthGuard>
    )
}
