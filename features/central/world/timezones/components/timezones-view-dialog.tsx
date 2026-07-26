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
import type { Timezone } from "@/features/central/world/types"

type TimezonesViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  timezone: Timezone
}

export function TimezonesViewDialog({
  open,
  onOpenChange,
  timezone,
}: TimezonesViewDialogProps) {
  const rows = [
    ["Name", timezone.name],
    [
      "Country",
      timezone.country?.name ??
        (timezone.country_id ? String(timezone.country_id) : "—"),
    ],
  ] as const

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Timezone details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Read-only overview for {timezone.name}.
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
