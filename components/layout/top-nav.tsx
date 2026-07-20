"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type TopNavProps = React.HTMLAttributes<HTMLElement> & {
    links: {
        title: string
        href: string
        isActive: boolean
        disabled?: boolean
    }[]
}

export function TopNav({ className, links, ...props }: TopNavProps) {
    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger
                    render={
                        <Button
                            size="icon"
                            variant="outline"
                            className={cn("md:size-7 lg:hidden", className)}
                        >
                            <Menu />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    }
                />
                <DropdownMenuContent side="bottom" align="start">
                    {links.map(({ title, href, isActive, disabled }) => (
                        <DropdownMenuItem
                            key={`${title}-${href}`}
                            disabled={disabled}
                            render={
                                <Link
                                    href={disabled ? "#" : href}
                                    aria-disabled={disabled}
                                    tabIndex={disabled ? -1 : undefined}
                                    className={cn(
                                        "w-full",
                                        !isActive && "text-muted-foreground",
                                        disabled && "pointer-events-none opacity-50"
                                    )}
                                >
                                    {title}
                                </Link>
                            }
                        />
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <nav
                className={cn(
                    "hidden items-center space-x-4 lg:flex lg:space-x-4 xl:space-x-6",
                    className
                )}
                {...props}
            >
                {links.map(({ title, href, isActive, disabled }) => (
                    <Link
                        key={`${title}-${href}`}
                        href={disabled ? "#" : href}
                        aria-disabled={disabled}
                        tabIndex={disabled ? -1 : undefined}
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            isActive ? "text-foreground" : "text-muted-foreground",
                            disabled && "pointer-events-none opacity-50 cursor-not-allowed"
                        )}
                    >
                        {title}
                    </Link>
                ))}
            </nav>
        </>
    )
}