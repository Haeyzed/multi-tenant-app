"use client"

import {PageHeader} from "@/components/layout/page-header"
import {CentralAuthGuard} from "@/features/central/auth/components/auth-guard"
import {LanguagesDialogs} from "@/features/central/world/languages/components/languages-dialogs"
import {LanguagesPrimaryButtons} from "@/features/central/world/languages/components/languages-primary-buttons"
import {LanguagesProvider} from "@/features/central/world/languages/components/languages-provider"
import {LanguagesStats} from "@/features/central/world/languages/components/languages-stats"
import {LanguagesTable} from "@/features/central/world/languages/components/languages-table"
import {Header} from "@/components/layout/header";
import {Search} from "@/components/search";
import {ThemeSwitch} from "@/components/theme-switch";
import {ConfigDrawer} from "@/components/config-drawer";
import {ProfileDropdown} from "@/features/central/shell/components/profile-dropdown";
import {Main} from "@/components/layout/main";
import {permissions} from "@/features/central/auth/permissions";

export default function LanguagesPage() {
    return (
        <CentralAuthGuard permissions={permissions.world.view}>
            <LanguagesProvider>
                <Header fixed>
                    <Search className='me-auto'/>
                    <ThemeSwitch/>
                    <ConfigDrawer/>
                    <ProfileDropdown/>
                </Header>
                <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
                    <PageHeader
                        title="Languages"
                        description="Manage locale language reference data."
                    >
                        <LanguagesPrimaryButtons/>
                    </PageHeader>
                    <LanguagesStats/>
                    <LanguagesTable/>
                    <LanguagesDialogs/>
                </Main>
            </LanguagesProvider>
        </CentralAuthGuard>
    )
}
