"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
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
import { useChargeInvoice } from "@/features/central/billing/invoices/hooks/use-invoice-query"
import {
  type ChargeInvoiceFormValues,
  chargeInvoiceSchema,
} from "@/features/central/billing/invoices/schemas"
import {
  findSelectOption,
  type SelectOption,
} from "@/features/central/shared/select-option"
import { catalogQueryOptions } from "@/lib/query/query-options"
import { getPaymentGatewayOptions } from "@/lib/services/central/payment-gateway-service"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import type { Invoice } from "@/types/central/invoice"

type InvoicesChargeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice
  onSuccess: () => void
}

export function InvoicesChargeDialog({
  open,
  onOpenChange,
  invoice,
  onSuccess,
}: InvoicesChargeDialogProps) {
  const chargeInvoice = useChargeInvoice()
  const form = useForm<ChargeInvoiceFormValues>({
    resolver: zodResolver(chargeInvoiceSchema),
    defaultValues: { gateway: "", amount: undefined },
  })

  const { data: gatewayOptions = [] } = useQuery({
    queryKey: ["central", "payment-gateways", "options"],
    queryFn: () => getPaymentGatewayOptions(),
    enabled: open,
    ...catalogQueryOptions,
  })

  const typedGatewayOptions = gatewayOptions as SelectOption<string>[]

  React.useEffect(() => {
    if (open) {
      form.reset({ gateway: "", amount: undefined })
    }
  }, [open, form])

  const onSubmit = (values: ChargeInvoiceFormValues) => {
    chargeInvoice.mutate(
      {
        id: invoice.id,
        values: {
          gateway: values.gateway || undefined,
          amount: values.amount || undefined,
        },
      },
      {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Invoice charged successfully")
          if (result.data.checkout_url) {
            window.open(
              result.data.checkout_url,
              "_blank",
              "noopener,noreferrer"
            )
          }
          onSuccess()
        },
        onError: (error) => {
          toastApiError(error, "Failed to charge invoice")
        },
      }
    )
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Charge invoice</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Attempt to charge invoice <strong>{invoice.number}</strong> through
            a payment gateway.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="charge-invoice-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Gateway</FieldLabel>
              <FieldContent>
                <Controller
                  control={form.control}
                  name="gateway"
                  render={({ field }) => {
                    const selected = findSelectOption(
                      typedGatewayOptions,
                      field.value || undefined
                    )

                    return (
                      <Combobox
                        items={typedGatewayOptions}
                        itemToStringValue={(item: SelectOption<string>) =>
                          item.label
                        }
                        value={selected}
                        onValueChange={(item: SelectOption<string> | null) =>
                          field.onChange(item?.value ?? "")
                        }
                      >
                        <ComboboxInput
                          placeholder="Select gateway..."
                          showClear
                        />
                        <ComboboxContent>
                          <ComboboxEmpty>No gateways found.</ComboboxEmpty>
                          <ComboboxList>
                            {(item: SelectOption<string>) => (
                              <ComboboxItem key={item.value} value={item}>
                                {item.label}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    )
                  }}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Amount (optional)</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder={String(invoice.balance_due)}
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
          </FieldGroup>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button
            type="submit"
            form="charge-invoice-form"
            disabled={chargeInvoice.isPending}
          >
            {chargeInvoice.isPending ? <Spinner /> : null}
            Charge
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
