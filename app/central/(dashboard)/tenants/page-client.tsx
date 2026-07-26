"use client"

import {PageHeader} from "@/components/layout/page-header"
import {CentralAuthGuard} from "@/features/central/auth/components/auth-guard"
import {TenantsBulkDialogs} from "@/features/central/tenants/components/tenants-bulk-dialogs"
import {TenantsDialogs} from "@/features/central/tenants/components/tenants-dialogs"
import {TenantsPrimaryButtons} from "@/features/central/tenants/components/tenants-primary-buttons"
import {TenantsProvider} from "@/features/central/tenants/components/tenants-provider"
import {TenantsStats} from "@/features/central/tenants/components/tenants-stats"
import {TenantsTable} from "@/features/central/tenants/components/tenants-table"
import {permissions} from "@/features/central/auth/permissions";
import {Header} from "@/components/layout/header"
import {ThemeSwitch} from "@/components/theme-switch";
import {ConfigDrawer} from "@/components/config-drawer";
import {Main} from "@/components/layout/main";
import {Search} from "@/components/search";
import {ProfileDropdown} from "@/features/central/shell/components/profile-dropdown";

export default function TenantsPage() {
    return (
        <CentralAuthGuard permissions={permissions.tenants.view}>
            <TenantsProvider>
                <Header fixed>
                    <Search className='me-auto'/>
                    <ThemeSwitch/>
                    <ConfigDrawer/>
                    <ProfileDropdown/>
                </Header>
                <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                    <PageHeader
                        title="Tenants"
                        description="Manage and monitor all tenants across your platform."
                    >
                        <TenantsPrimaryButtons/>
                    </PageHeader>
                    <TenantsStats/>
                    <TenantsTable/>
                    <TenantsDialogs/>
                    <TenantsBulkDialogs/>
                </Main>
            </TenantsProvider>
        </CentralAuthGuard>
    )
}
