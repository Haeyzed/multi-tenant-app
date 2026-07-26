"use client"

import {PageHeader} from "@/components/layout/page-header"
import {CentralAuthGuard} from "@/features/central/auth/components/auth-guard"
import {FeaturesDialogs} from "@/features/central/billing/features/components/features-dialogs"
import {FeaturesPrimaryButtons} from "@/features/central/billing/features/components/features-primary-buttons"
import {FeaturesProvider} from "@/features/central/billing/features/components/features-provider"
import {FeaturesTable} from "@/features/central/billing/features/components/features-table"
import {permissions} from "@/features/central/auth/permissions"
import {Header} from "@/components/layout/header"
import {ThemeSwitch} from "@/components/theme-switch"
import {ConfigDrawer} from "@/components/config-drawer"
import {Main} from "@/components/layout/main"
import {Search} from "@/components/search"
import {ProfileDropdown} from "@/features/central/shell/components/profile-dropdown"

export default function FeaturesPage() {
    return (
        <CentralAuthGuard permissions={permissions.features.view}>
            <FeaturesProvider>
                <Header fixed>
                    <Search className="me-auto"/>
                    <ThemeSwitch/>
                    <ConfigDrawer/>
                    <ProfileDropdown/>
                </Header>
                <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
                    <PageHeader
                        title="Features"
                        description="Manage billable features tenants can access."
                    >
                        <FeaturesPrimaryButtons/>
                    </PageHeader>
                    <FeaturesTable/>
                    <FeaturesDialogs/>
                </Main>
            </FeaturesProvider>
        </CentralAuthGuard>
    )
}
