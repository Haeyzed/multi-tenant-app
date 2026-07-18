"use client"

import { ConfigDrawer } from "@/components/config-drawer"
import { Header } from "@/components/layout/header"
import { Main } from "@/components/layout/main"
import { Search } from "@/components/search"
import { SkipToMain } from "@/components/skip-to-main"
import { ThemeSwitch } from "@/components/theme-switch"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getCookie } from "@/lib/cookies"
import { DirectionProvider } from "@/lib/providers/direction-provider"
import { LayoutProvider } from "@/lib/providers/layout-provider"
import { SearchProvider } from "@/lib/providers/search-provider"
import { cn } from "@/lib/utils"

type DashboardShellProps = {
  sidebar: React.ReactNode
  children: React.ReactNode
  commandMenu?: React.ReactNode
}

export function DashboardShell({
  sidebar,
  children,
  commandMenu,
}: DashboardShellProps) {
  const defaultOpen = getCookie("sidebar_state") !== "false"

  return (
    <DirectionProvider>
      <SearchProvider>
        <LayoutProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            <SkipToMain />
            {sidebar}
            {commandMenu}
            <SidebarInset
              className={cn(
                "@container/content",
                "has-data-[layout=fixed]:h-svh",
                "peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]"
              )}
            >
              <Header>
                {commandMenu ? <Search className="me-auto" /> : null}
                <ThemeSwitch />
                <ConfigDrawer />
              </Header>
              <Main>{children}</Main>
            </SidebarInset>
          </SidebarProvider>
        </LayoutProvider>
      </SearchProvider>
    </DirectionProvider>
  )
}
