"use client"

import {ChevronsUpDownIcon, LogOutIcon} from "lucide-react"
import * as React from "react"

import {SignOutDialog} from "@/features/central/shell/components/sign-out-dialog"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,} from "@/components/ui/sidebar"
import {useCentralAuth} from "@/lib/providers/central-auth-provider"

export function NavUser() {
    const {isMobile} = useSidebar()
    const {user} = useCentralAuth()
    const [signOutOpen, setSignOutOpen] = React.useState(false)

    if (!user) {
        return null
    }

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <SidebarMenuButton
                                    size="lg"
                                    className="aria-expanded:bg-muted"
                                />
                            }
                        >
                            <Avatar>
                                <AvatarImage
                                    src={user.avatar_url ?? undefined}
                                    alt={user.name}
                                />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-start text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                                <span className="truncate text-xs">{user.email}</span>
                            </div>
                            <ChevronsUpDownIcon className="ms-auto size-4"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-fit"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                                        <Avatar>
                                            <AvatarImage
                                                src={user.avatar_url ?? undefined}
                                                alt={user.name}
                                            />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-start text-sm leading-tight">
                                            <span className="truncate font-medium">{user.name}</span>
                                            <span className="truncate text-xs">{user.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setSignOutOpen(true)}
                            >
                                <LogOutIcon className="mr-2 size-4"/>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

            <SignOutDialog open={signOutOpen} onOpenChange={setSignOutOpen}/>
        </>
    )
}
