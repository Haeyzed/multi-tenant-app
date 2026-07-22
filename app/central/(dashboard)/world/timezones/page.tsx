"use client"

import {PageHeader} from "@/components/layout/page-header"
import {CentralAuthGuard} from "@/features/central/auth/components/auth-guard"
import {TimezonesDialogs} from "@/features/central/world/timezones/components/timezones-dialogs"
import {TimezonesPrimaryButtons} from "@/features/central/world/timezones/components/timezones-primary-buttons"
import {TimezonesProvider} from "@/features/central/world/timezones/components/timezones-provider"
import {TimezonesStats} from "@/features/central/world/timezones/components/timezones-stats"
import {TimezonesTable} from "@/features/central/world/timezones/components/timezones-table"
import {Header} from "@/components/layout/header";
import {Search} from "@/components/search";
import {ThemeSwitch} from "@/components/theme-switch";
import {ConfigDrawer} from "@/components/config-drawer";
import {ProfileDropdown} from "@/features/central/shell/profile-dropdown";
import {Main} from "@/components/layout/main";
import {permissions} from "@/features/central/auth/components/permissions";

export default function TimezonesPage() {
    return (
        <CentralAuthGuard permissions={permissions.world.view}>
            <TimezonesProvider>
                <Header fixed>
                    <Search className='me-auto'/>
                    <ThemeSwitch/>
                    <ConfigDrawer/>
                    <ProfileDropdown/>
                </Header>
                <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                    <PageHeader
                        title="Timezones"
                        description="Manage timezone reference data by country."
                    >
                        <TimezonesPrimaryButtons/>
                    </PageHeader>
                    <TimezonesStats/>
                    <TimezonesTable/>
                    <TimezonesDialogs/>
                </Main>
            </TimezonesProvider>
        </CentralAuthGuard>
    )
}
