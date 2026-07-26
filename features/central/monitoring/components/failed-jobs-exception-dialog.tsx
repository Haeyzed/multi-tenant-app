"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Textarea } from "@/components/ui/textarea"
import type { FailedJob } from "@/types/central/monitoring"

type FailedJobsExceptionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  job: FailedJob
}

export function FailedJobsExceptionDialog({
  open,
  onOpenChange,
  job,
}: FailedJobsExceptionDialogProps) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-3xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Failed job exception</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Exception snippet for failed job #{job.id}.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ScrollArea className="h-96 rounded-md border">
          <Textarea
            readOnly
            value={job.exception || "No exception available."}
            className="min-h-96 resize-none border-0 font-mono text-xs focus-visible:ring-0"
          />
        </ScrollArea>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
