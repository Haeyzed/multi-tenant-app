"use client"

import {PageHeader} from "@/components/layout/page-header"
import {CentralAuthGuard} from "@/features/central/auth/components/auth-guard"
import {InvoicesDialogs} from "@/features/central/billing/invoices/components/invoices-dialogs"
import {InvoicesPrimaryButtons} from "@/features/central/billing/invoices/components/invoices-primary-buttons"
import {InvoicesProvider} from "@/features/central/billing/invoices/components/invoices-provider"
import {InvoicesStats} from "@/features/central/billing/invoices/components/invoices-stats"
import {InvoicesTable} from "@/features/central/billing/invoices/components/invoices-table"
import {permissions} from "@/features/central/auth/components/permissions"
import {Header} from "@/components/layout/header"
import {ThemeSwitch} from "@/components/theme-switch"
import {ConfigDrawer} from "@/components/config-drawer"
import {Main} from "@/components/layout/main"
import {Search} from "@/components/search"
import {ProfileDropdown} from "@/features/central/shell/profile-dropdown"

export default function InvoicesPage() {
    return (
        <CentralAuthGuard permissions={permissions.billing.invoices.view}>
            <InvoicesProvider>
                <Header fixed>
                    <Search className="me-auto"/>
                    <ThemeSwitch/>
                    <ConfigDrawer/>
                    <ProfileDropdown/>
                </Header>
                <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
                    <PageHeader
                        title="Invoices"
                        description="Manage tenant invoices and billing."
                    >
                        <InvoicesPrimaryButtons/>
                    </PageHeader>
                    <InvoicesStats/>
                    <InvoicesTable/>
                    <InvoicesDialogs/>
                </Main>
            </InvoicesProvider>
        </CentralAuthGuard>
    )
}
