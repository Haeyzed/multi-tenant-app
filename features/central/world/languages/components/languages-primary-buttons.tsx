"use client"

import {LockIcon, Plus} from "lucide-react"

import {Button} from "@/components/ui/button"
import {PermissionGate} from "@/features/central/auth/components/permission-gate"
import {permissions} from "@/features/central/auth/components/permissions"
import {useLanguagesContext} from "@/features/central/world/languages/components/languages-provider"

export function LanguagesPrimaryButtons() {
    const {setOpen} = useLanguagesContext()

    return (
        <PermissionGate
            permissions={[permissions.world.create]}
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
            </Button>_
        </PermissionGate>
    )
}