"use client"

import {PageHeader} from "@/components/layout/page-header"
import {CentralAuthGuard} from "@/features/central/auth/components/auth-guard"
import {StatesDialogs} from "@/features/central/world/states/components/states-dialogs"
import {StatesPrimaryButtons} from "@/features/central/world/states/components/states-primary-buttons"
import {StatesProvider} from "@/features/central/world/states/components/states-provider"
import {StatesStats} from "@/features/central/world/states/components/states-stats"
import {StatesTable} from "@/features/central/world/states/components/states-table"
import {Header} from "@/components/layout/header";
import {Search} from "@/components/search";
import {ThemeSwitch} from "@/components/theme-switch";
import {ConfigDrawer} from "@/components/config-drawer";
import {ProfileDropdown} from "@/features/central/shell/profile-dropdown";
import {Main} from "@/components/layout/main";
import {permissions} from "@/features/central/auth/components/permissions";

export default function StatesPage() {
    return (
        <CentralAuthGuard permissions={permissions.world.view}>
            <StatesProvider>
                <Header fixed>
                    <Search className='me-auto'/>
                    <ThemeSwitch/>
                    <ConfigDrawer/>
                    <ProfileDropdown/>
                </Header>
                <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                    <PageHeader
                        title="States"
                        description="Manage state and province reference data by country."
                    >
                        <StatesPrimaryButtons/>
                    </PageHeader>
                    <StatesStats/>
                    <StatesTable/>
                    <StatesDialogs/>
                </Main>
            </StatesProvider>
        </CentralAuthGuard>
    )
}
