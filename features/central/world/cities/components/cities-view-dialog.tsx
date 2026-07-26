"use client"

import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import type { City } from "@/types/central/world"

type CitiesViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  city: City
}

export function CitiesViewDialog({
  open,
  onOpenChange,
  city,
}: CitiesViewDialogProps) {
  const rows = [
    ["Name", city.name],
    ["State", city.state?.name ?? String(city.state_id)],
    ["Country", city.country?.name ?? String(city.country_id)],
    ["Country code", city.country_code || "—"],
    ["State code", city.state_code || "—"],
  ] as const

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>City details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Read-only overview for {city.name}.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="flex max-h-[65vh] flex-col gap-3 overflow-y-auto pe-1 text-sm">
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

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
