"use client"

import Link from "next/link"
import {usePathname, useRouter} from "next/navigation"

import {buttonVariants} from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {cn} from "@/lib/utils"

export type SidebarNavItem = {
    href: string
    title: string
    icon: React.ReactNode
}

type SidebarNavProps = React.HTMLAttributes<HTMLElement> & {
    items: SidebarNavItem[]
}

export function SidebarNav({className, items, ...props}: SidebarNavProps) {
    const pathname = usePathname()
    const router = useRouter()

    const activeHref =
        items.find(
            (item) => pathname === item.href || pathname?.startsWith(`${item.href}/`)
        )?.href ??
        items[0]?.href ??
        ""

    const handleSelect = (value: string | null) => {
        if (!value) {
            return
        }
        router.push(value)
    }

    return (
        <>
            <div className="p-1 md:hidden">
                <Select value={activeHref} onValueChange={handleSelect}>
                    <SelectTrigger className="h-12 w-full sm:w-48">
                        <SelectValue placeholder="Select section"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {items.map((item) => (
                                <SelectItem key={item.href} value={item.href}>
                                    <div className="flex items-center gap-x-4 px-2 py-1">
                                        <span className="scale-125">{item.icon}</span>
                                        <span className="text-md">{item.title}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <nav
                className={cn(
                    "hidden min-h-0 w-full min-w-40 flex-1 overflow-y-auto bg-background px-1 py-2 md:block",
                    className
                )}
                {...props}
            >
                <div className="flex flex-col gap-1">
                    {items.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            pathname?.startsWith(`${item.href}/`)

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    buttonVariants({variant: "ghost"}),
                                    isActive
                                        ? "bg-muted hover:bg-accent"
                                        : "hover:bg-accent hover:underline",
                                    "w-full justify-start"
                                )}
                            >
                                <span className="me-2">{item.icon}</span>
                                {item.title}
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}
