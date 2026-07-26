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
import type { Language } from "@/types/central/world"

type LanguagesViewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  language: Language
}

export function LanguagesViewDialog({
  open,
  onOpenChange,
  language,
}: LanguagesViewDialogProps) {
  const rows = [
    ["Name", language.name],
    ["Native name", language.name_native || "—"],
    ["Code", language.code],
  ] as const

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Language details</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Read-only overview for {language.name}.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="flex max-h-[65vh] flex-col gap-3 overflow-y-auto pe-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Direction</span>
            <Badge variant="outline" className="uppercase">
              {language.dir || "ltr"}
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
