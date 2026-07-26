"use client"

import {PageHeader} from "@/components/layout/page-header"
import {CentralAuthGuard} from "@/features/central/auth/components/auth-guard"
import {CountriesDialogs} from "@/features/central/world/countries/components/countries-dialogs"
import {CountriesPrimaryButtons} from "@/features/central/world/countries/components/countries-primary-buttons"
import {CountriesProvider} from "@/features/central/world/countries/components/countries-provider"
import {CountriesStats} from "@/features/central/world/countries/components/countries-stats"
import {CountriesTable} from "@/features/central/world/countries/components/countries-table"
import {Header} from "@/components/layout/header";
import {Search} from "@/components/search";
import {ThemeSwitch} from "@/components/theme-switch";
import {ConfigDrawer} from "@/components/config-drawer";
import {ProfileDropdown} from "@/features/central/shell/components/profile-dropdown";
import {Main} from "@/components/layout/main";
import {permissions} from "@/features/central/auth/permissions";

export default function CountriesPage() {
    return (
        <CentralAuthGuard permissions={permissions.world.view}>
            <CountriesProvider>
                <Header fixed>
                    <Search className='me-auto'/>
                    <ThemeSwitch/>
                    <ConfigDrawer/>
                    <ProfileDropdown/>
                </Header>
                <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                    <PageHeader
                        title="Countries"
                        description="Manage country reference data used across the platform."
                    >
                        <CountriesPrimaryButtons/>
                    </PageHeader>
                    <CountriesStats/>
                    <CountriesTable/>
                    <CountriesDialogs/>
                </Main>
            </CountriesProvider>
        </CentralAuthGuard>
    )
}
