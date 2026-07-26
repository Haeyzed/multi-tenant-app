"use client"

import {PageHeader} from "@/components/layout/page-header"
import {CentralAuthGuard} from "@/features/central/auth/components/auth-guard"
import {PlansBulkDialogs} from "@/features/central/billing/plans/components/plans-bulk-dialogs"
import {PlansDialogs} from "@/features/central/billing/plans/components/plans-dialogs"
import {PlansPrimaryButtons} from "@/features/central/billing/plans/components/plans-primary-buttons"
import {PlansProvider} from "@/features/central/billing/plans/components/plans-provider"
import {PlansStats} from "@/features/central/billing/plans/components/plans-stats"
import {PlansTable} from "@/features/central/billing/plans/components/plans-table"
import {Header} from "@/components/layout/header";
import {Search} from "@/components/search";
import {ThemeSwitch} from "@/components/theme-switch";
import {ConfigDrawer} from "@/components/config-drawer";
import {ProfileDropdown} from "@/features/central/shell/components/profile-dropdown";
import {Main} from "@/components/layout/main";
import {permissions} from "@/features/central/auth/permissions";

export default function PlansPage() {
    return (
        <CentralAuthGuard permissions={permissions.plans.view}>
            <PlansProvider>
                <Header fixed>
                    <Search className='me-auto'/>
                    <ThemeSwitch/>
                    <ConfigDrawer/>
                    <ProfileDropdown/>
                </Header>
                <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                    <PageHeader
                        title="Plans"
                        description="Configure billing plans available to tenants."
                    >
                        <PlansPrimaryButtons/>
                    </PageHeader>
                    <PlansStats/>
                    <PlansTable/>
                    <PlansDialogs/>
                    <PlansBulkDialogs/>
                </Main>
            </PlansProvider>
        </CentralAuthGuard>
    )
}
