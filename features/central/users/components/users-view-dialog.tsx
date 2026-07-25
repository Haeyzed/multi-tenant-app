"use client"

import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {
    ResponsiveDialog,
    ResponsiveDialogClose,
    ResponsiveDialogContent,
    ResponsiveDialogDescription,
    ResponsiveDialogFooter,
    ResponsiveDialogHeader,
    ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import type {CentralUser} from "@/types/central/user"

type UsersViewDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: CentralUser
}

function getInitials(name?: string | null): string {
    if (!name) {
        return "?"
    }

    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
        return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase()
    }

    return (parts[0]?.[0] ?? "?").toUpperCase()
}

export function UsersViewDialog({
                                    open,
                                    onOpenChange,
                                    user,
                                }: UsersViewDialogProps) {
    const rows = [
        ["Name", user.name],
        ["Email", user.email],
        ["Phone", user.phone || "—"],
        ["Timezone", user.timezone || "—"],
        ["Roles", (user.roles ?? []).join(", ") || "—"],
        [
            "Last login",
            user.last_login_at
                ? new Date(user.last_login_at).toLocaleString()
                : "—",
        ],
        [
            "Created",
            user.created_at_human ??
            (user.created_at ? new Date(user.created_at).toLocaleString() : "—"),
        ],
    ] as const

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>User details</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Read-only overview for {user.name}.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <div className="max-h-[65vh] space-y-4 overflow-y-auto pe-1 text-sm">
                    <div className="flex flex-col items-center gap-3 py-2">
                        <Avatar className="size-20">
                            {user.avatar_url ? (
                                <AvatarImage src={user.avatar_url} alt={user.name}/>
                            ) : null}
                            <AvatarFallback className="text-xl">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-muted-foreground text-sm">{user.email}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Status</span>
                            <Badge className="capitalize">
                                {user.status_label ?? user.status ?? "—"}
                            </Badge>
                            {user.two_factor_enabled ? (
                                <Badge variant="outline">2FA</Badge>
                            ) : null}
                        </div>
                        {rows.map(([label, value]) => (
                            <div
                                key={label}
                                className="flex items-start justify-between gap-4 border-b pb-2 last:border-b-0"
                            >
                                <span className="text-muted-foreground">{label}</span>
                                <span className="text-end font-medium">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <ResponsiveDialogFooter>
                    <ResponsiveDialogClose
                        render={<Button variant="outline">Close</Button>}
                    />
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}
