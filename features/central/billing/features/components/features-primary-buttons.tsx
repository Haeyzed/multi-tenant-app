"use client"

import {LockIcon, Plus} from "lucide-react"

import {Button} from "@/components/ui/button"
import {PermissionGate} from "@/features/central/auth/components/permission-gate"
import {permissions} from "@/features/central/auth/permissions"
import {useFeatures} from "@/features/central/billing/features/components/features-provider"

export function FeaturesPrimaryButtons() {
    const {setOpen} = useFeatures()

    return (
        <PermissionGate
            permissions={[permissions.features.create]}
            fallback={
                <Button disabled variant="outline" className="gap-1 opacity-60">
                    <LockIcon className="size-3.5"/>
                    <span>Create</span>
                </Button>
            }
        >
            <Button className="gap-1" onClick={() => setOpen("create")}>
                <span>Create</span>
                <Plus className="size-4"/>
            </Button>
        </PermissionGate>
    )
}