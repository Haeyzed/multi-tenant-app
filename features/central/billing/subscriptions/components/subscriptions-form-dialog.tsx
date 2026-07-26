"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import * as React from "react"
import { Controller, useForm, useWatch } from "react-hook-form"

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
  FieldDescription,
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
import { useCreateSubscription } from "@/features/central/billing/subscriptions/hooks/use-subscription-query"
import {
  type StoreSubscriptionFormValues,
  storeSubscriptionSchema,
} from "@/features/central/billing/subscriptions/schemas"
import { useCountryOptions } from "@/features/central/world/hooks/use-world-query"
import { handleFormApiError } from "@/lib/form-api-errors"
import { getPlans } from "@/lib/services/central/plan-service"
import { getTenantOptions } from "@/lib/services/central/tenant-service"
import { catalogQueryOptions } from "@/lib/query/query-options"
import { toastApiSuccess } from "@/lib/toast-api"
import type { Plan, PlanPrice } from "@/types/central/plan"
import type { CountryOption } from "@/types/central/world"
import { PermissionGate } from "@/features/central/auth/components/permission-gate"
import { permissions } from "@/features/central/auth/permissions"
import {
  findSelectOption,
  type SelectOption,
} from "@/features/central/shared/select-option"

type SubscriptionsFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaults: StoreSubscriptionFormValues = {
  tenant_id: "",
  plan_id: 0,
  country: "",
  plan_price_id: null,
  currency: "",
  billing_interval: null,
  gateway: "",
  trial_days: null,
}

function priceLabel(price: PlanPrice): string {
  const interval = price.billing_interval ?? "monthly"
  return `${price.currency} ${Number(price.amount).toFixed(2)} / ${interval}`
}

export function SubscriptionsFormDialog({
  open,
  onOpenChange,
}: SubscriptionsFormDialogProps) {
  const createSubscription = useCreateSubscription()
  const isSubmitting = createSubscription.isPending
  const { data: countryOptions = [] } = useCountryOptions()

  const { data: tenants = [] } = useQuery({
    queryKey: ["central", "tenants", "options"],
    queryFn: () => getTenantOptions(),
    enabled: open,
    ...catalogQueryOptions,
  })

  const { data: plans = [] } = useQuery({
    queryKey: [
      "central",
      "plans",
      "options",
      { status: "active", withPrices: true },
    ],
    queryFn: () => getPlans({ status: "active", per_page: 100 }),
    enabled: open,
    select: (result) => result.data as Plan[],
    ...catalogQueryOptions,
  })

  const form = useForm<StoreSubscriptionFormValues>({
    resolver: zodResolver(storeSubscriptionSchema),
    defaultValues: defaults,
  })

  const selectedPlanId = useWatch({ control: form.control, name: "plan_id" })
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId)
  const priceOptions: SelectOption<number>[] = (selectedPlan?.prices ?? []).map(
    (price) => ({
      label: priceLabel(price),
      value: price.id,
    })
  )
  const planOptions: SelectOption<number>[] = plans.map((plan) => ({
    label: plan.name,
    value: plan.id,
  }))
  const tenantOptions: SelectOption<string>[] = tenants.map((tenant) => ({
    label: tenant.label,
    value: tenant.value,
  }))

  React.useEffect(() => {
    if (open) {
      form.reset(defaults)
    }
  }, [open, form])

  React.useEffect(() => {
    form.setValue("plan_price_id", null)
  }, [selectedPlanId, form])

  const onSubmit = (data: StoreSubscriptionFormValues) => {
    createSubscription.mutate(
      {
        tenant_id: data.tenant_id,
        plan_id: data.plan_id,
        country: data.country || undefined,
        plan_price_id: data.plan_price_id || undefined,
        currency: data.currency || undefined,
        billing_interval: data.billing_interval || undefined,
        gateway: data.gateway || undefined,
        trial_days: data.trial_days ?? null,
      },
      {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Subscription created successfully")
          onOpenChange(false)
        },
        onError: (error) => {
          handleFormApiError(
            error,
            form.setError,
            "Failed to create subscription"
          )
        },
      }
    )
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Create subscription</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Subscribe a tenant using country-aware plan pricing. Gateway is
            resolved from currency unless you override it.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="subscription-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Tenant</FieldLabel>
              <FieldContent>
                <Controller
                  control={form.control}
                  name="tenant_id"
                  render={({ field }) => {
                    const selected = findSelectOption(
                      tenantOptions,
                      field.value
                    )
                    return (
                      <Combobox
                        items={tenantOptions}
                        itemToStringValue={(item: SelectOption<string>) =>
                          item.label
                        }
                        value={selected}
                        onValueChange={(item: SelectOption<string> | null) =>
                          field.onChange(item?.value ?? "")
                        }
                      >
                        <ComboboxInput
                          placeholder="Select tenant..."
                          showClear
                        />
                        <ComboboxContent>
                          <ComboboxEmpty>No tenants found.</ComboboxEmpty>
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
              <FieldLabel>Billing country</FieldLabel>
              <FieldContent>
                <Controller
                  control={form.control}
                  name="country"
                  render={({ field }) => {
                    const selected =
                      countryOptions.find(
                        (option: CountryOption) => option.value === field.value
                      ) ?? null
                    return (
                      <Combobox
                        items={countryOptions}
                        itemToStringValue={(item: CountryOption) => item.label}
                        value={selected}
                        onValueChange={(item: CountryOption | null) =>
                          field.onChange(item?.value ?? "")
                        }
                      >
                        <ComboboxInput
                          placeholder="Select country..."
                          showClear
                        />
                        <ComboboxContent>
                          <ComboboxEmpty>No countries found.</ComboboxEmpty>
                          <ComboboxList>
                            {(item: CountryOption) => (
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
                <FieldDescription>
                  Used to pick the matching plan currency when no price is
                  selected.
                </FieldDescription>
                <FieldError
                  errors={
                    form.formState.errors.country
                      ? [form.formState.errors.country]
                      : []
                  }
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Plan</FieldLabel>
              <FieldContent>
                <Controller
                  control={form.control}
                  name="plan_id"
                  render={({ field }) => {
                    const selected = findSelectOption(planOptions, field.value)
                    return (
                      <Combobox
                        items={planOptions}
                        itemToStringValue={(item: SelectOption<number>) =>
                          item.label
                        }
                        value={selected}
                        onValueChange={(item: SelectOption<number> | null) =>
                          field.onChange(item?.value ?? 0)
                        }
                      >
                        <ComboboxInput placeholder="Select plan..." showClear />
                        <ComboboxContent>
                          <ComboboxEmpty>No plans found.</ComboboxEmpty>
                          <ComboboxList>
                            {(item: SelectOption<number>) => (
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
                    form.formState.errors.plan_id
                      ? [form.formState.errors.plan_id]
                      : []
                  }
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Plan price (optional)</FieldLabel>
              <FieldContent>
                <Controller
                  control={form.control}
                  name="plan_price_id"
                  render={({ field }) => {
                    const selected = findSelectOption(
                      priceOptions,
                      field.value ?? undefined
                    )
                    return (
                      <Combobox
                        items={priceOptions}
                        itemToStringValue={(item: SelectOption<number>) =>
                          item.label
                        }
                        value={selected}
                        onValueChange={(item: SelectOption<number> | null) =>
                          field.onChange(item?.value ?? null)
                        }
                        disabled={priceOptions.length === 0}
                      >
                        <ComboboxInput
                          placeholder={
                            selectedPlanId
                              ? "Auto from country, or pick a price..."
                              : "Select a plan first..."
                          }
                          showClear
                        />
                        <ComboboxContent>
                          <ComboboxEmpty>
                            No prices for this plan.
                          </ComboboxEmpty>
                          <ComboboxList>
                            {(item: SelectOption<number>) => (
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
                    form.formState.errors.plan_price_id
                      ? [form.formState.errors.plan_price_id]
                      : []
                  }
                />
              </FieldContent>
            </Field>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Gateway override (optional)</FieldLabel>
                <FieldContent>
                  <Input
                    {...form.register("gateway")}
                    placeholder="paystack / stripe / flutterwave"
                  />
                </FieldContent>
              </Field>
              <Field>
                <FieldLabel>Trial days (optional)</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    min="0"
                    {...form.register("trial_days", {
                      setValueAs: (value) => {
                        if (
                          value === "" ||
                          value === null ||
                          value === undefined
                        ) {
                          return null
                        }
                        const parsed = Number(value)
                        return Number.isNaN(parsed) ? null : parsed
                      },
                    })}
                  />
                </FieldContent>
              </Field>
            </div>
          </FieldGroup>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <PermissionGate permissions={[permissions.subscriptions.create]}>
            <Button
              type="submit"
              form="subscription-form"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : null}
              Create
            </Button>
          </PermissionGate>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
