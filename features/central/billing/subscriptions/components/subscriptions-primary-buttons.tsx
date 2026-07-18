"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { useSubscriptions } from "@/features/central/billing/subscriptions/components/subscriptions-provider"

export function SubscriptionsPrimaryButtons() {
    const { setOpen } = useSubscriptions()

    return (
        <PermissionGate permissions="subscriptions.create">
            <Button className="gap-1" onClick={() => setOpen("create")}>
                <span>Create</span>
                <Plus className="size-4" />
            </Button>
        </PermissionGate>
    )
}
