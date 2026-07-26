"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useCancelSubscription } from "@/features/central/billing/subscriptions/hooks/use-subscription-query"
import {
  type CancelSubscriptionFormValues,
  cancelSubscriptionSchema,
} from "@/features/central/billing/subscriptions/schemas"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import type { Subscription } from "@/features/central/billing/subscriptions/types"

type SubscriptionsCancelDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: Subscription
  onSuccess: () => void
}

export function SubscriptionsCancelDialog({
  open,
  onOpenChange,
  subscription,
  onSuccess,
}: SubscriptionsCancelDialogProps) {
  const cancelSubscription = useCancelSubscription()
  const form = useForm<CancelSubscriptionFormValues>({
    resolver: zodResolver(cancelSubscriptionSchema),
    defaultValues: { immediately: false, reason: "" },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({ immediately: false, reason: "" })
    }
  }, [open, form])

  const onSubmit = (values: CancelSubscriptionFormValues) => {
    cancelSubscription.mutate(
      { id: subscription.id, values },
      {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Subscription cancelled successfully")
          onSuccess()
        },
        onError: (error) => {
          toastApiError(error, "Failed to cancel subscription")
        },
      }
    )
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Cancel subscription</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Cancel subscription #{subscription.id} for{" "}
            {subscription.tenant?.name ?? subscription.tenant_id}.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="cancel-subscription-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Reason (optional)</FieldLabel>
              <FieldContent>
                <Textarea
                  {...form.register("reason")}
                  placeholder="Customer requested cancellation"
                  rows={3}
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Cancel immediately</FieldLabel>
              <FieldContent>
                <Controller
                  control={form.control}
                  name="immediately"
                  render={({ field }) => (
                    <div className="flex h-8 items-center gap-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className="text-sm text-muted-foreground">
                        Otherwise cancels at period end
                      </span>
                    </div>
                  )}
                />
              </FieldContent>
            </Field>
          </FieldGroup>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
          <Button
            type="submit"
            form="cancel-subscription-form"
            variant="destructive"
            disabled={cancelSubscription.isPending}
          >
            {cancelSubscription.isPending ? <Spinner /> : null}
            Cancel subscription
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
