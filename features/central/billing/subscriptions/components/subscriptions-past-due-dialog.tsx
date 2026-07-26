"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Spinner } from "@/components/ui/spinner"
import { useMarkSubscriptionPastDue } from "@/features/central/billing/subscriptions/hooks/use-subscription-query"
import {
  type MarkPastDueFormValues,
  markPastDueSchema,
} from "@/features/central/billing/subscriptions/schemas"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import type { Subscription } from "@/types/central/subscription"

type SubscriptionsPastDueDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: Subscription
  onSuccess: () => void
}

export function SubscriptionsPastDueDialog({
  open,
  onOpenChange,
  subscription,
  onSuccess,
}: SubscriptionsPastDueDialogProps) {
  const markPastDue = useMarkSubscriptionPastDue()
  const form = useForm<MarkPastDueFormValues>({
    resolver: zodResolver(markPastDueSchema),
    defaultValues: { grace_days: 3 },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({ grace_days: 3 })
    }
  }, [open, form])

  const onSubmit = (values: MarkPastDueFormValues) => {
    markPastDue.mutate(
      { id: subscription.id, values },
      {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Subscription marked past due")
          onSuccess()
        },
        onError: (error) => {
          toastApiError(error, "Failed to mark subscription past due")
        },
      }
    )
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Mark past due</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Start a grace period for subscription #{subscription.id}.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="past-due-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Grace days</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  min="1"
                  max="30"
                  {...form.register("grace_days", {
                    setValueAs: (value) => {
                      if (
                        value === "" ||
                        value === null ||
                        value === undefined
                      ) {
                        return undefined
                      }
                      const parsed = Number(value)
                      return Number.isNaN(parsed) ? undefined : parsed
                    },
                  })}
                />
                <FieldError
                  errors={
                    form.formState.errors.grace_days
                      ? [form.formState.errors.grace_days]
                      : []
                  }
                />
              </FieldContent>
            </Field>
          </FieldGroup>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button
            type="submit"
            form="past-due-form"
            disabled={markPastDue.isPending}
          >
            {markPastDue.isPending ? <Spinner /> : null}
            Mark past due
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
