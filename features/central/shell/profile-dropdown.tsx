"use client"

import * as React from "react"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutDialog } from "@/features/central/shell/sign-out-dialog"
import { useCentralAuth } from "@/lib/providers/central-auth-provider"

export function ProfileDropdown() {
    const { user } = useCentralAuth()
    const [signOutOpen, setSignOutOpen] = React.useState(false)

    if (!user) {
        return null
    }

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger
                    render={
                        <Button variant="ghost" className="relative size-8 rounded-full">
                            <Avatar className="size-8">
                                <AvatarImage src={user.avatar_url ?? undefined} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Button>
                    }
                />
                <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col gap-1.5">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-muted-foreground text-xs leading-none">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            render={
                                <Link href="/settings">
                                    <span>Profile</span>
                                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                </Link>
                            }
                        />
                        <DropdownMenuItem
                            render={
                                <Link href="/settings">
                                    <span>Billing</span>
                                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                </Link>
                            }
                        />
                        <DropdownMenuItem
                            render={
                                <Link href="/settings">
                                    <span>Settings</span>
                                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                </Link>
                            }
                        />
                        <DropdownMenuItem>New Team</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setSignOutOpen(true)}
                    >
                        <span>Sign out</span>
                        <DropdownMenuShortcut className="text-current">
                            ⇧⌘Q
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <SignOutDialog open={signOutOpen} onOpenChange={setSignOutOpen} />
        </>
    )
}