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
import type { State } from "@/features/central/world/types"

type StatesViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  state: State
}

export function StatesViewDialog({
  open,
  onOpenChange,
  state,
}: StatesViewDialogProps) {
  const rows = [
    ["Name", state.name],
    ["State code", state.state_code || "—"],
    ["Country", state.country?.name ?? String(state.country_id)],
    ["Country code", state.country_code || "—"],
    ["Type", state.type || "—"],
  ] as const

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>State details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Read-only overview for {state.name}.
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
