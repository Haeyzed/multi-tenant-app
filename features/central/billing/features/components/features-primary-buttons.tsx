"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { useFeatures } from "@/features/central/billing/features/components/features-provider"

export function FeaturesPrimaryButtons() {
  const { setOpen } = useFeatures()

  return (
    <PermissionGate permissions="features.create">
      <Button className="gap-1" onClick={() => setOpen("create")}>
        <span>Create</span>
        <Plus className="size-4" />
      </Button>
    </PermissionGate>
  )
}
