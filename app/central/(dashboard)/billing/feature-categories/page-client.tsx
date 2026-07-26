"use client"

import {PageHeader} from "@/components/layout/page-header"
import {CentralAuthGuard} from "@/features/central/auth/components/auth-guard"
import {
    FeatureCategoriesDialogs
} from "@/features/central/billing/feature-categories/components/feature-categories-dialogs"
import {
    FeatureCategoriesPrimaryButtons
} from "@/features/central/billing/feature-categories/components/feature-categories-primary-buttons"
import {
    FeatureCategoriesProvider
} from "@/features/central/billing/feature-categories/components/feature-categories-provider"
import {FeatureCategoriesTable} from "@/features/central/billing/feature-categories/components/feature-categories-table"
import {permissions} from "@/features/central/auth/permissions"
import {Header} from "@/components/layout/header"
import {ThemeSwitch} from "@/components/theme-switch"
import {ConfigDrawer} from "@/components/config-drawer"
import {Main} from "@/components/layout/main"
import {Search} from "@/components/search"
import {ProfileDropdown} from "@/features/central/shell/components/profile-dropdown"

export default function FeatureCategoriesPage() {
    return (
        <CentralAuthGuard permissions={permissions.features.view}>
            <FeatureCategoriesProvider>
                <Header fixed>
                    <Search className="me-auto"/>
                    <ThemeSwitch/>
                    <ConfigDrawer/>
                    <ProfileDropdown/>
                </Header>
                <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
                    <PageHeader
                        title="Feature categories"
                        description="Group related features for easier management."
                    >
                        <FeatureCategoriesPrimaryButtons/>
                    </PageHeader>
                    <FeatureCategoriesTable/>
                    <FeatureCategoriesDialogs/>
                </Main>
            </FeatureCategoriesProvider>
        </CentralAuthGuard>
    )
}
