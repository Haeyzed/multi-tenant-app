"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import * as React from "react"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { useCreateInvoice } from "@/features/central/billing/invoices/hooks/use-invoice-query"
import {
  type StoreInvoiceFormValues,
  storeInvoiceSchema,
} from "@/features/central/billing/invoices/schemas"
import { handleFormApiError } from "@/lib/form-api-errors"
import { getSubscriptionOptions } from "@/lib/services/central/subscription-service"
import { getTenantOptions } from "@/lib/services/central/tenant-service"
import { toastApiSuccess } from "@/lib/toast-api"

type InvoicesFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Option<T extends string | number> = { label: string; value: T }

const defaults: StoreInvoiceFormValues = {
  tenant_id: "",
  subscription_id: null,
  tax_rate: undefined,
  currency: "",
  notes: "",
  items: [{ description: "", quantity: 1, unit_price: 0 }],
}

export function InvoicesFormDialog({
  open,
  onOpenChange,
}: InvoicesFormDialogProps) {
  const createInvoice = useCreateInvoice()
  const isSubmitting = createInvoice.isPending

  const { data: tenants = [] } = useQuery({
    queryKey: ["central", "tenants", "options"],
    queryFn: () => getTenantOptions(),
    enabled: open,
  })

  const form = useForm<StoreInvoiceFormValues>({
    resolver: zodResolver(storeInvoiceSchema),
    defaultValues: defaults,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const tenantId = useWatch({ control: form.control, name: "tenant_id" })

  const { data: subscriptions = [] } = useQuery({
    queryKey: ["central", "subscriptions", "options", { tenant_id: tenantId }],
    queryFn: () => getSubscriptionOptions({ tenant_id: tenantId }),
    enabled: open && !!tenantId,
  })

  React.useEffect(() => {
    if (open) {
      form.reset(defaults)
    }
  }, [open, form])

  const onSubmit = (data: StoreInvoiceFormValues) => {
    createInvoice.mutate(
      {
        ...data,
        subscription_id: data.subscription_id || undefined,
        currency: data.currency || undefined,
        notes: data.notes || undefined,
      },
      {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Invoice created successfully")
          onOpenChange(false)
        },
        onError: (error) => {
          handleFormApiError(error, form.setError, "Failed to create invoice")
        },
      }
    )
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-2xl">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Create invoice</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Bill a tenant for one or more line items.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="invoice-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Tenant</FieldLabel>
                <FieldContent>
                  <Controller
                    control={form.control}
                    name="tenant_id"
                    render={({ field }) => {
                      const selected =
                        tenants.find(
                          (option) => option.value === field.value
                        ) ?? null
                      return (
                        <Combobox
                          items={tenants}
                          itemToStringValue={(item: Option<string>) =>
                            item.label
                          }
                          value={selected}
                          onValueChange={(item: Option<string> | null) => {
                            field.onChange(item?.value ?? "")
                            form.setValue("subscription_id", null)
                          }}
                        >
                          <ComboboxInput
                            placeholder="Select tenant..."
                            showClear
                          />
                          <ComboboxContent>
                            <ComboboxEmpty>No tenants found.</ComboboxEmpty>
                            <ComboboxList>
                              {(item: Option<string>) => (
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
                  <FieldError
                    errors={
                      form.formState.errors.tenant_id
                        ? [form.formState.errors.tenant_id]
                        : []
                    }
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Subscription (optional)</FieldLabel>
                <FieldContent>
                  <Controller
                    control={form.control}
                    name="subscription_id"
                    render={({ field }) => {
                      const selected =
                        subscriptions.find(
                          (option) => option.value === String(field.value ?? "")
                        ) ?? null
                      return (
                        <Combobox
                          items={subscriptions}
                          itemToStringValue={(item: Option<string>) =>
                            item.label
                          }
                          value={selected}
                          onValueChange={(item: Option<string> | null) =>
                            field.onChange(item ? Number(item.value) : null)
                          }
                        >
                          <ComboboxInput
                            placeholder="Select subscription..."
                            showClear
                            disabled={!tenantId}
                          />
                          <ComboboxContent>
                            <ComboboxEmpty>
                              No subscriptions found.
                            </ComboboxEmpty>
                            <ComboboxList>
                              {(item: Option<string>) => (
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
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field>
                <FieldLabel>Currency (optional)</FieldLabel>
                <FieldContent>
                  <Input
                    {...form.register("currency")}
                    placeholder="USD"
                    maxLength={3}
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Tax rate % (optional)</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    {...form.register("tax_rate")}
                  />
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel>Notes (optional)</FieldLabel>
              <FieldContent>
                <Textarea
                  {...form.register("notes")}
                  placeholder="Internal notes for this invoice"
                  rows={2}
                />
              </FieldContent>
            </Field>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FieldLabel>Line items</FieldLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() =>
                    append({ description: "", quantity: 1, unit_price: 0 })
                  }
                >
                  <Plus className="size-4" />
                  Add item
                </Button>
              </div>

              <div className="space-y-3">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 gap-2 rounded-md border p-3 md:grid-cols-[1fr_5rem_7rem_2rem]"
                  >
                    <Field>
                      <FieldLabel className="md:sr-only">
                        Description
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          {...form.register(`items.${index}.description`)}
                          placeholder="Description"
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel className="md:sr-only">Qty</FieldLabel>
                      <FieldContent>
                        <Input
                          type="number"
                          min="1"
                          {...form.register(`items.${index}.quantity`)}
                        />
                      </FieldContent>
                    </Field>
                    <Field>
                      <FieldLabel className="md:sr-only">
                        Unit price
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...form.register(`items.${index}.unit_price`)}
                        />
                      </FieldContent>
                    </Field>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="self-center"
                      disabled={fields.length <= 1}
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {typeof form.formState.errors.items?.message === "string" ? (
                <p className="text-destructive text-sm">
                  {form.formState.errors.items.message}
                </p>
              ) : null}
            </div>
          </FieldGroup>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button type="submit" form="invoice-form" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : null}
            Create invoice
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
