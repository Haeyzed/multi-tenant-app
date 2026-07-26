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
import type { Currency } from "@/types/central/world"

type CurrenciesViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currency: Currency
}

export function CurrenciesViewDialog({
  open,
  onOpenChange,
  currency,
}: CurrenciesViewDialogProps) {
  const rows = [
    ["Name", currency.name],
    ["Code", currency.code],
    ["Symbol", currency.symbol || "—"],
    ["Native symbol", currency.symbol_native || "—"],
    [
      "Precision",
      currency.precision !== null ? String(currency.precision) : "—",
    ],
    [
      "Country",
      currency.country?.name ??
        (currency.country_id ? String(currency.country_id) : "—"),
    ],
  ] as const

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Currency details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Read-only overview for {currency.name}.
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
