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
import {
  useDowngradeSubscription,
  useUpgradeSubscription,
} from "@/features/central/billing/subscriptions/hooks/use-subscription-query"
import {
  type ChangeSubscriptionPlanFormValues,
  changeSubscriptionPlanSchema,
} from "@/features/central/billing/subscriptions/schemas"
import {
  findSelectOption,
  type SelectOption,
} from "@/features/central/shared/select-option"
import { useCountryOptions } from "@/features/central/world/hooks/use-world-query"
import { getPlans } from "@/lib/services/central/plan-service"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import type { Plan, PlanPrice } from "@/features/central/billing/plans/types"
import type { Subscription } from "@/features/central/billing/subscriptions/types"
import type { CountryOption } from "@/features/central/world/types"

type ChangePlanMode = "upgrade" | "downgrade"

type SubscriptionsChangePlanDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: Subscription
  mode: ChangePlanMode
  onSuccess: () => void
}

function priceLabel(price: PlanPrice): string {
  const interval = price.billing_interval ?? "monthly"
  return `${price.currency} ${Number(price.amount).toFixed(2)} / ${interval}`
}

function useActivePlans(enabled: boolean) {
  return useQuery({
    queryKey: [
      "central",
      "plans",
      "options",
      { status: "active", withPrices: true },
    ],
    queryFn: async (): Promise<Plan[]> => {
      const result = await getPlans({ status: "active", per_page: 100 })
      return result.data as Plan[]
    },
    enabled,
  })
}

export function SubscriptionsChangePlanDialog({
  open,
  onOpenChange,
  subscription,
  mode,
  onSuccess,
}: SubscriptionsChangePlanDialogProps) {
  const upgradeSubscription = useUpgradeSubscription()
  const downgradeSubscription = useDowngradeSubscription()
  const { data: plans = [] } = useActivePlans(open)
  const { data: countryOptions = [] } = useCountryOptions()

  const form = useForm<ChangeSubscriptionPlanFormValues>({
    resolver: zodResolver(changeSubscriptionPlanSchema),
    defaultValues: {
      plan_id: 0,
      country: "",
      plan_price_id: null,
      currency: "",
      billing_interval: null,
    },
  })

  const selectedPlanId = useWatch({
    control: form.control,
    name: "plan_id",
  })
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

  React.useEffect(() => {
    if (open) {
      form.reset({
        plan_id: 0,
        country: "",
        plan_price_id: null,
        currency: subscription.currency || "",
        billing_interval: null,
      })
    }
  }, [open, subscription, form])

  React.useEffect(() => {
    form.setValue("plan_price_id", null)
  }, [selectedPlanId, form])

  const isPending =
    upgradeSubscription.isPending || downgradeSubscription.isPending

  const onSubmit = (values: ChangeSubscriptionPlanFormValues) => {
    const mutation =
      mode === "upgrade" ? upgradeSubscription : downgradeSubscription
    const label = mode === "upgrade" ? "upgraded" : "downgraded"

    mutation.mutate(
      {
        id: subscription.id,
        values: {
          plan_id: values.plan_id,
          country: values.country || undefined,
          plan_price_id: values.plan_price_id || undefined,
          currency: values.currency || subscription.currency || undefined,
          billing_interval: values.billing_interval || undefined,
        },
      },
      {
        onSuccess: (result) => {
          toastApiSuccess(result.message, `Subscription ${label} successfully`)
          onSuccess()
        },
        onError: (error) => {
          toastApiError(error, `Failed to ${mode} subscription`)
        },
      }
    )
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {mode === "upgrade" ? "Upgrade" : "Downgrade"} subscription
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Choose a new plan and price for subscription #{subscription.id}.
            Gateway is re-resolved from the selected currency.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <form
          id="change-plan-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Field>
              <FieldLabel>New plan</FieldLabel>
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
                        <ComboboxInput
                          placeholder="Select plan..."
                          showClear
                        />
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
              <FieldLabel>Billing country (optional)</FieldLabel>
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
                          placeholder="Keep current currency if empty"
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
                  Defaults to resolving against the subscription currency (
                  {subscription.currency}).
                </FieldDescription>
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
                              ? "Auto-resolve, or pick a price..."
                              : "Select a plan first..."
                          }
                          showClear
                        />
                        <ComboboxContent>
                          <ComboboxEmpty>No prices for this plan.</ComboboxEmpty>
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
              </FieldContent>
            </Field>
          </FieldGroup>
        </form>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <Button type="submit" form="change-plan-form" disabled={isPending}>
            {isPending ? <Spinner /> : null}
            {mode === "upgrade" ? "Upgrade" : "Downgrade"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
