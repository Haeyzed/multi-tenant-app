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
import { Textarea } from "@/components/ui/textarea"
import { useRefundPayment } from "@/features/central/billing/payments/hooks/use-payment-query"
import {
  type RefundPaymentFormValues,
  refundPaymentSchema,
} from "@/features/central/billing/payments/schemas"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import type { Payment } from "@/features/central/billing/payments/types"

type PaymentsRefundDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: Payment
  onSuccess: () => void
}

export function PaymentsRefundDialog({
  open,
  onOpenChange,
  payment,
  onSuccess,
}: PaymentsRefundDialogProps) {
  const refundPayment = useRefundPayment()
  const form = useForm<RefundPaymentFormValues>({
    resolver: zodResolver(refundPaymentSchema),
    defaultValues: { amount: undefined, reason: "" },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({ amount: undefined, reason: "" })
    }
  }, [open, form])

  const onSubmit = (values: RefundPaymentFormValues) => {
    refundPayment.mutate(
      {
        id: payment.id,
        values: {
          amount: values.amount || undefined,
          reason: values.reason || undefined,
        },
      },
      {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Refund processed successfully")
          onSuccess()
        },
        onError: (error) => {
          toastApiError(error, "Failed to process refund")
        },
      }
    )
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Refund payment</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Refund payment #{payment.id}. Leave amount blank to refund in full.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="refund-payment-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Amount (optional)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder={String(payment.amount)}
                  {...form.register("amount", {
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
                    form.formState.errors.amount
                      ? [form.formState.errors.amount]
                      : []
                  }
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Reason (optional)</FieldLabel>
              <FieldContent>
                <Textarea
                  {...form.register("reason")}
                  placeholder="Customer requested refund"
                  rows={3}
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
            form="refund-payment-form"
            variant="destructive"
            disabled={refundPayment.isPending}
          >
            {refundPayment.isPending ? <Spinner /> : null}
            Refund
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
