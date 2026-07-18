"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { useFeatureCategories } from "@/features/central/billing/feature-categories/components/feature-categories-provider"

export function FeatureCategoriesPrimaryButtons() {
  const { setOpen } = useFeatureCategories()

  return (
    <PermissionGate permissions="features.manage-categories">
      <Button className="gap-1" onClick={() => setOpen("create")}>
        <span>Create</span>
        <Plus className="size-4" />
      </Button>
    </PermissionGate>
  )
}
