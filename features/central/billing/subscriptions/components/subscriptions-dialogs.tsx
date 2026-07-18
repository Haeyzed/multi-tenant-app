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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useSubscriptions } from "@/features/central/billing/subscriptions/components/subscriptions-provider"
import { SubscriptionsFormDialog } from "@/features/central/billing/subscriptions/components/subscriptions-form-dialog"
import { SubscriptionsViewDialog } from "@/features/central/billing/subscriptions/components/subscriptions-view-dialog"
import {
  useCancelSubscription,
  useDowngradeSubscription,
  useExpireSubscription,
  useMarkSubscriptionPastDue,
  usePauseSubscription,
  useRenewSubscription,
  useResumeSubscription,
  useUpgradeSubscription,
} from "@/features/central/billing/subscriptions/hooks/use-subscription-query"
import {
  type CancelSubscriptionFormValues,
  cancelSubscriptionSchema,
  type ChangeSubscriptionPlanFormValues,
  changeSubscriptionPlanSchema,
  type MarkPastDueFormValues,
  markPastDueSchema,
} from "@/features/central/billing/subscriptions/schemas"
import { useCountryOptions } from "@/features/central/world/hooks/use-world-query"
import { getPlans } from "@/lib/services/central/plan-service"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"
import type { Plan, PlanPrice } from "@/types/central/plan"
import type { CountryOption } from "@/types/central/world"

type Option<T extends string | number> = { label: string; value: T }

function priceLabel(price: PlanPrice): string {
  const interval = price.billing_interval ?? "monthly"
  return `${price.currency} ${Number(price.amount).toFixed(2)} / ${interval}`
}

function useActivePlans(enabled: boolean) {
  return useQuery({
    queryKey: ["central", "plans", "options", { status: "active", withPrices: true }],
    queryFn: () => getPlans({ status: "active", per_page: 100 }),
    enabled,
    select: (result) => result.data as Plan[],
  })
}

export function SubscriptionsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useSubscriptions()

  const renewSubscription = useRenewSubscription()
  const pauseSubscription = usePauseSubscription()
  const resumeSubscription = useResumeSubscription()
  const expireSubscription = useExpireSubscription()
  const cancelSubscription = useCancelSubscription()
  const markPastDue = useMarkSubscriptionPastDue()
  const upgradeSubscription = useUpgradeSubscription()
  const downgradeSubscription = useDowngradeSubscription()

  const { data: plans = [] } = useActivePlans(
    open === "upgrade" || open === "downgrade"
  )
  const { data: countryOptions = [] } = useCountryOptions()

  const cancelForm = useForm<CancelSubscriptionFormValues>({
    resolver: zodResolver(cancelSubscriptionSchema),
    defaultValues: { immediately: false, reason: "" },
  })

  const pastDueForm = useForm<MarkPastDueFormValues>({
    resolver: zodResolver(markPastDueSchema),
    defaultValues: { grace_days: 3 },
  })

  const changePlanForm = useForm<ChangeSubscriptionPlanFormValues>({
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
    control: changePlanForm.control,
    name: "plan_id",
  })
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId)
  const priceOptions = (selectedPlan?.prices ?? []).map((price) => ({
    label: priceLabel(price),
    value: price.id,
  }))
  const planOptions = plans.map((plan) => ({
    label: plan.name,
    value: plan.id,
  }))

  const handleClose = React.useCallback(() => {
    setOpen(null)
    setTimeout(() => {
      setCurrentRow(null)
      cancelForm.reset({ immediately: false, reason: "" })
      pastDueForm.reset({ grace_days: 3 })
      changePlanForm.reset({
        plan_id: 0,
        country: "",
        plan_price_id: null,
        currency: "",
        billing_interval: null,
      })
    }, 300)
  }, [setOpen, setCurrentRow, cancelForm, pastDueForm, changePlanForm])

  React.useEffect(() => {
    changePlanForm.setValue("plan_price_id", null)
  }, [selectedPlanId, changePlanForm])

  React.useEffect(() => {
    if ((open === "upgrade" || open === "downgrade") && currentRow) {
      changePlanForm.reset({
        plan_id: 0,
        country: "",
        plan_price_id: null,
        currency: currentRow.currency || "",
        billing_interval: null,
      })
    }
  }, [open, currentRow, changePlanForm])

  const runSimpleAction = (
    label: string,
    mutate: (id: number, options: { onSuccess: (result: { message?: string }) => void; onError: (error: unknown) => void }) => void
  ) => {
    if (!currentRow) {
      return
    }

    mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(result.message, `Subscription ${label} successfully`)
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, `Failed to ${label} subscription`)
      },
    })
  }

  const onCancelSubmit = (values: CancelSubscriptionFormValues) => {
    if (!currentRow) {
      return
    }

    cancelSubscription.mutate(
      { id: currentRow.id, values },
      {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Subscription cancelled successfully")
          handleClose()
        },
        onError: (error) => {
          toastApiError(error, "Failed to cancel subscription")
        },
      }
    )
  }

  const onPastDueSubmit = (values: MarkPastDueFormValues) => {
    if (!currentRow) {
      return
    }

    markPastDue.mutate(
      { id: currentRow.id, values },
      {
        onSuccess: (result) => {
          toastApiSuccess(result.message, "Subscription marked past due")
          handleClose()
        },
        onError: (error) => {
          toastApiError(error, "Failed to mark subscription past due")
        },
      }
    )
  }

  const onChangePlanSubmit = (values: ChangeSubscriptionPlanFormValues) => {
    if (!currentRow) {
      return
    }

    const mutation =
      open === "upgrade" ? upgradeSubscription : downgradeSubscription
    const label = open === "upgrade" ? "upgraded" : "downgraded"

    mutation.mutate(
      {
        id: currentRow.id,
        values: {
          plan_id: values.plan_id,
          country: values.country || undefined,
          plan_price_id: values.plan_price_id || undefined,
          currency: values.currency || currentRow.currency || undefined,
          billing_interval: values.billing_interval || undefined,
        },
      },
      {
        onSuccess: (result) => {
          toastApiSuccess(result.message, `Subscription ${label} successfully`)
          handleClose()
        },
        onError: (error) => {
          toastApiError(error, `Failed to ${open} subscription`)
        },
      }
    )
  }

  return (
    <>
      <SubscriptionsFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <SubscriptionsViewDialog
            key={`subscription-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            subscription={currentRow}
          />

          <ResponsiveDialog
            open={open === "renew"}
            onOpenChange={(val) => !val && handleClose()}
          >
            <ResponsiveDialogContent className="sm:max-w-md">
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Renew subscription</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Advance the billing period for subscription #{currentRow.id}?
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button
                  disabled={renewSubscription.isPending}
                  onClick={() =>
                    runSimpleAction("renewed", (id, options) =>
                      renewSubscription.mutate(id, options)
                    )
                  }
                >
                  {renewSubscription.isPending ? <Spinner /> : null}
                  Renew
                </Button>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>

          <ResponsiveDialog
            open={open === "pause"}
            onOpenChange={(val) => !val && handleClose()}
          >
            <ResponsiveDialogContent className="sm:max-w-md">
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Pause subscription</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Temporarily suspend billing and access for subscription #
                  {currentRow.id}?
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button
                  disabled={pauseSubscription.isPending}
                  onClick={() =>
                    runSimpleAction("paused", (id, options) =>
                      pauseSubscription.mutate(id, options)
                    )
                  }
                >
                  {pauseSubscription.isPending ? <Spinner /> : null}
                  Pause
                </Button>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>

          <ResponsiveDialog
            open={open === "resume"}
            onOpenChange={(val) => !val && handleClose()}
          >
            <ResponsiveDialogContent className="sm:max-w-md">
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Resume subscription</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Resume billing and access for subscription #{currentRow.id}?
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button
                  disabled={resumeSubscription.isPending}
                  onClick={() =>
                    runSimpleAction("resumed", (id, options) =>
                      resumeSubscription.mutate(id, options)
                    )
                  }
                >
                  {resumeSubscription.isPending ? <Spinner /> : null}
                  Resume
                </Button>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>

          <ResponsiveDialog
            open={open === "expire"}
            onOpenChange={(val) => !val && handleClose()}
          >
            <ResponsiveDialogContent className="sm:max-w-md">
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Expire subscription</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Mark subscription #{currentRow.id} as expired? This revokes
                  access immediately.
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>
              <ResponsiveDialogFooter>
                <ResponsiveDialogClose
                  render={<Button variant="outline">Cancel</Button>}
                />
                <Button
                  variant="destructive"
                  disabled={expireSubscription.isPending}
                  onClick={() =>
                    runSimpleAction("expired", (id, options) =>
                      expireSubscription.mutate(id, options)
                    )
                  }
                >
                  {expireSubscription.isPending ? <Spinner /> : null}
                  Expire
                </Button>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>

          <ResponsiveDialog
            open={open === "cancel"}
            onOpenChange={(val) => !val && handleClose()}
          >
            <ResponsiveDialogContent className="sm:max-w-md">
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Cancel subscription</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Cancel subscription #{currentRow.id} for{" "}
                  {currentRow.tenant?.name ?? currentRow.tenant_id}.
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>

              <form
                id="cancel-subscription-form"
                className="space-y-4"
                onSubmit={cancelForm.handleSubmit(onCancelSubmit)}
              >
                <FieldGroup>
                  <Field>
                    <FieldLabel>Reason (optional)</FieldLabel>
                    <FieldContent>
                      <Textarea
                        {...cancelForm.register("reason")}
                        placeholder="Customer requested cancellation"
                        rows={3}
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel>Cancel immediately</FieldLabel>
                    <FieldContent>
                      <Controller
                        control={cancelForm.control}
                        name="immediately"
                        render={({ field }) => (
                          <div className="flex h-8 items-center gap-2">
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <span className="text-muted-foreground text-sm">
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

          <ResponsiveDialog
            open={open === "past-due"}
            onOpenChange={(val) => !val && handleClose()}
          >
            <ResponsiveDialogContent className="sm:max-w-md">
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>Mark past due</ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Start a grace period for subscription #{currentRow.id}.
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>

              <form
                id="past-due-form"
                className="space-y-4"
                onSubmit={pastDueForm.handleSubmit(onPastDueSubmit)}
              >
                <FieldGroup>
                  <Field>
                    <FieldLabel>Grace days</FieldLabel>
                    <FieldContent>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        {...pastDueForm.register("grace_days")}
                      />
                      <FieldError
                        errors={
                          pastDueForm.formState.errors.grace_days
                            ? [pastDueForm.formState.errors.grace_days]
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

          <ResponsiveDialog
            open={open === "upgrade" || open === "downgrade"}
            onOpenChange={(val) => !val && handleClose()}
          >
            <ResponsiveDialogContent className="sm:max-w-md">
              <ResponsiveDialogHeader>
                <ResponsiveDialogTitle>
                  {open === "upgrade" ? "Upgrade" : "Downgrade"} subscription
                </ResponsiveDialogTitle>
                <ResponsiveDialogDescription>
                  Choose a new plan and price for subscription #{currentRow.id}.
                  Gateway is re-resolved from the selected currency.
                </ResponsiveDialogDescription>
              </ResponsiveDialogHeader>

              <form
                id="change-plan-form"
                className="space-y-4"
                onSubmit={changePlanForm.handleSubmit(onChangePlanSubmit)}
              >
                <FieldGroup>
                  <Field>
                    <FieldLabel>New plan</FieldLabel>
                    <FieldContent>
                      <Controller
                        control={changePlanForm.control}
                        name="plan_id"
                        render={({ field }) => {
                          const selected =
                            planOptions.find(
                              (option) => option.value === field.value
                            ) ?? null
                          return (
                            <Combobox
                              items={planOptions}
                              itemToStringValue={(item: Option<number>) =>
                                item.label
                              }
                              value={selected}
                              onValueChange={(item: Option<number> | null) =>
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
                                  {(item: Option<number>) => (
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
                          changePlanForm.formState.errors.plan_id
                            ? [changePlanForm.formState.errors.plan_id]
                            : []
                        }
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Billing country (optional)</FieldLabel>
                    <FieldContent>
                      <Controller
                        control={changePlanForm.control}
                        name="country"
                        render={({ field }) => {
                          const selected =
                            countryOptions.find(
                              (option: CountryOption) =>
                                option.value === field.value
                            ) ?? null
                          return (
                            <Combobox
                              items={countryOptions}
                              itemToStringValue={(item: CountryOption) =>
                                item.label
                              }
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
                        Defaults to resolving against the subscription currency
                        ({currentRow.currency}).
                      </FieldDescription>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel>Plan price (optional)</FieldLabel>
                    <FieldContent>
                      <Controller
                        control={changePlanForm.control}
                        name="plan_price_id"
                        render={({ field }) => {
                          const selected =
                            priceOptions.find(
                              (option) => option.value === field.value
                            ) ?? null
                          return (
                            <Combobox
                              items={priceOptions}
                              itemToStringValue={(item: Option<number>) =>
                                item.label
                              }
                              value={selected}
                              onValueChange={(item: Option<number> | null) =>
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
                                <ComboboxEmpty>
                                  No prices for this plan.
                                </ComboboxEmpty>
                                <ComboboxList>
                                  {(item: Option<number>) => (
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
                <Button
                  type="submit"
                  form="change-plan-form"
                  disabled={
                    upgradeSubscription.isPending ||
                    downgradeSubscription.isPending
                  }
                >
                  {upgradeSubscription.isPending ||
                  downgradeSubscription.isPending ? (
                    <Spinner />
                  ) : null}
                  {open === "upgrade" ? "Upgrade" : "Downgrade"}
                </Button>
              </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
          </ResponsiveDialog>
        </>
      ) : null}
    </>
  )
}
