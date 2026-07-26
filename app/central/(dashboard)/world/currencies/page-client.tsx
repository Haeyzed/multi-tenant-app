"use client"

import {PageHeader} from "@/components/layout/page-header"
import {CentralAuthGuard} from "@/features/central/auth/components/auth-guard"
import {CurrenciesDialogs} from "@/features/central/world/currencies/components/currencies-dialogs"
import {CurrenciesPrimaryButtons} from "@/features/central/world/currencies/components/currencies-primary-buttons"
import {CurrenciesProvider} from "@/features/central/world/currencies/components/currencies-provider"
import {CurrenciesStats} from "@/features/central/world/currencies/components/currencies-stats"
import {CurrenciesTable} from "@/features/central/world/currencies/components/currencies-table"
import {Header} from "@/components/layout/header";
import {Search} from "@/components/search";
import {ThemeSwitch} from "@/components/theme-switch";
import {ConfigDrawer} from "@/components/config-drawer";
import {ProfileDropdown} from "@/features/central/shell/components/profile-dropdown";
import {Main} from "@/components/layout/main";
import {permissions} from "@/features/central/auth/permissions";

export default function CurrenciesPage() {
    return (
        <CentralAuthGuard permissions={permissions.world.view}>
            <CurrenciesProvider>
                <Header fixed>
                    <Search className='me-auto'/>
                    <ThemeSwitch/>
                    <ConfigDrawer/>
                    <ProfileDropdown/>
                </Header>
                <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                    <PageHeader
                        title="Currencies"
                        description="Manage currency reference data by country."
                    >
                        <CurrenciesPrimaryButtons/>
                    </PageHeader>
                    <CurrenciesStats/>
                    <CurrenciesTable/>
                    <CurrenciesDialogs/>
                </Main>
            </CurrenciesProvider>
        </CentralAuthGuard>
    )
}
