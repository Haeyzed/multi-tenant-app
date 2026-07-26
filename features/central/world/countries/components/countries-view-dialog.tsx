"use client"

import { Badge } from "@/components/ui/badge"
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
import type { Country } from "@/types/central/world"

type CountriesViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  country: Country
}

export function CountriesViewDialog({
  open,
  onOpenChange,
  country,
}: CountriesViewDialogProps) {
  const rows = [
    ["Name", country.name],
    ["Native", country.native || "—"],
    ["ISO2", country.iso2],
    ["ISO3", country.iso3 || "—"],
    ["Phone code", country.phone_code ? `+${country.phone_code}` : "—"],
    ["Region", country.region || "—"],
    ["Subregion", country.subregion || "—"],
    ["Currency", country.currency_code || "—"],
    ["Emoji", country.emoji || "—"],
  ] as const

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Country details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Read-only overview for {country.name}.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="flex max-h-[65vh] flex-col gap-3 overflow-y-auto pe-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Status</span>
            <Badge>
              {Number(country.status ?? 1) === 1 ? "Active" : "Inactive"}
            </Badge>
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

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
