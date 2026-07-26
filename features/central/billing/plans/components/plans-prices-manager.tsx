"use client"

import * as React from "react"
import {PencilIcon, PlusIcon, Trash2Icon, XIcon} from "lucide-react"

import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import {Field, FieldContent, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {NativeSelect, NativeSelectOption,} from "@/components/ui/native-select"
import {Spinner} from "@/components/ui/spinner"
import {
    useCreatePlanPrice,
    useDeletePlanPrice,
    usePlanPrices,
    useUpdatePlanPrice,
} from "@/features/central/billing/plans/hooks/use-plan-query"
import {useBillingDefaultInterval} from "@/features/central/settings/hooks/use-setting-query"
import {useCurrencyOptions} from "@/features/central/world/hooks/use-world-query"
import {toastApiError, toastApiSuccess} from "@/lib/toast-api"
import type {PlanPrice, PlanPriceInterval, PlanStatus} from "@/types/central/plan"
import type {CurrencyOption} from "@/types/central/world"

type PriceDraft = {
    amount: string
    currency: string
    billing_interval: PlanPriceInterval
    trial_days: string
    status: PlanStatus
    stripe_id: string
    paystack_id: string
    flutterwave_id: string
}

function emptyDraft(defaultInterval: PlanPriceInterval): PriceDraft {
    return {
        amount: "",
        currency: "",
        billing_interval: defaultInterval,
        trial_days: "",
        status: "active",
        stripe_id: "",
        paystack_id: "",
        flutterwave_id: "",
    }
}

const intervalOptions: { label: string; value: PlanPriceInterval }[] = [
    {label: "Monthly", value: "monthly"},
    {label: "Quarterly", value: "quarterly"},
    {label: "Yearly", value: "yearly"},
]

const statusOptions: { label: string; value: PlanStatus }[] = [
    {label: "Active", value: "active"},
    {label: "Draft", value: "draft"},
    {label: "Inactive", value: "inactive"},
    {label: "Archived", value: "archived"},
]

export function PlansPricesManager({planId}: { planId: number }) {
    const {data: prices = [], isLoading} = usePlanPrices(planId)
    const {data: currencyOptions = []} = useCurrencyOptions()
    const defaultBillingInterval = useBillingDefaultInterval()
    const createPrice = useCreatePlanPrice(planId)
    const updatePrice = useUpdatePlanPrice(planId)
    const deletePrice = useDeletePlanPrice(planId)

    const [editingId, setEditingId] = React.useState<number | "new" | null>(
        null
    )
    const [draft, setDraft] = React.useState<PriceDraft>(() =>
        emptyDraft(defaultBillingInterval)
    )

    function startCreate() {
        setDraft(emptyDraft(defaultBillingInterval))
        setEditingId("new")
    }

    function startEdit(price: PlanPrice) {
        setDraft({
            amount: String(price.amount),
            currency: price.currency,
            billing_interval: price.billing_interval ?? defaultBillingInterval,
            trial_days: price.trial_days != null ? String(price.trial_days) : "",
            status: price.status ?? "active",
            stripe_id: price.gateway_identifiers?.stripe ?? "",
            paystack_id: price.gateway_identifiers?.paystack ?? "",
            flutterwave_id: price.gateway_identifiers?.flutterwave ?? "",
        })
        setEditingId(price.id)
    }

    function cancelEdit() {
        setEditingId(null)
        setDraft(emptyDraft(defaultBillingInterval))
    }

    function save() {
        const currency = draft.currency.trim().toUpperCase()
        if (currency.length !== 3) {
            toastApiError(new Error("Select a currency."))
            return
        }

        const payload = {
            amount: Number(draft.amount || 0),
            currency,
            billing_interval: draft.billing_interval,
            trial_days: draft.trial_days === "" ? null : Number(draft.trial_days),
            status: draft.status,
            gateway_identifiers: {
                stripe: draft.stripe_id.trim() || null,
                paystack: draft.paystack_id.trim() || null,
                flutterwave: draft.flutterwave_id.trim() || null,
            },
        }

        if (editingId === "new") {
            createPrice.mutate(payload, {
                onSuccess: (result) => {
                    toastApiSuccess(result.message, "Price added")
                    cancelEdit()
                },
                onError: (error) => toastApiError(error, "Failed to add price"),
            })
            return
        }

        if (typeof editingId === "number") {
            updatePrice.mutate(
                {priceId: editingId, values: payload},
                {
                    onSuccess: (result) => {
                        toastApiSuccess(result.message, "Price updated")
                        cancelEdit()
                    },
                    onError: (error) => toastApiError(error, "Failed to update price"),
                }
            )
        }
    }

    function remove(priceId: number) {
        deletePrice.mutate(priceId, {
            onSuccess: (result) => toastApiSuccess(result.message, "Price removed"),
            onError: (error) => toastApiError(error, "Failed to remove price"),
        })
    }

    const isSaving = createPrice.isPending || updatePrice.isPending

    return (
        <div className="space-y-3 rounded-lg border p-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Prices by currency</span>
                {editingId === null ? (
                    <Button type="button" size="sm" variant="outline" onClick={startCreate}>
                        <PlusIcon className="size-4"/> Add price
                    </Button>
                ) : null}
            </div>

            {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Spinner/> Loading prices...
                </div>
            ) : (
                <div className="space-y-2">
                    {prices.length === 0 && editingId === null ? (
                        <p className="text-sm text-muted-foreground">
                            No additional currency prices yet.
                        </p>
                    ) : null}

                    {prices.map((price) =>
                            editingId === price.id ? (
                                <PriceForm
                                    key={price.id}
                                    draft={draft}
                                    setDraft={setDraft}
                                    currencyOptions={currencyOptions}
                                    onCancel={cancelEdit}
                                    onSave={save}
                                    isSaving={isSaving}
                                />
                            ) : (
                                <div
                                    key={price.id}
                                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm"
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="outline">{price.currency}</Badge>
                                        <span className="font-medium">
                    {Number(price.amount).toFixed(2)}
                  </span>
                                        <span className="text-muted-foreground">
                    /{price.billing_interval_label ?? price.billing_interval}
                  </span>
                                        {price.trial_days ? (
                                            <span className="text-muted-foreground">
                      · {price.trial_days}d trial
                    </span>
                                        ) : null}
                                        {price.gateway_identifiers &&
                                        Object.values(price.gateway_identifiers).some(Boolean) ? (
                                            <span className="text-muted-foreground">
                                                · gateway IDs set
                                            </span>
                                        ) : null}
                                        <Badge variant={price.status === "active" ? "secondary" : "outline"}>
                                            {price.status_label ?? price.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="size-7"
                                            onClick={() => startEdit(price)}
                                            disabled={editingId !== null}
                                        >
                                            <PencilIcon className="size-4"/>
                                        </Button>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="size-7"
                                            onClick={() => remove(price.id)}
                                            disabled={deletePrice.isPending}
                                        >
                                            <Trash2Icon className="size-4"/>
                                        </Button>
                                    </div>
                                </div>
                            )
                    )}

                    {editingId === "new" ? (
                        <PriceForm
                            draft={draft}
                            setDraft={setDraft}
                            currencyOptions={currencyOptions}
                            onCancel={cancelEdit}
                            onSave={save}
                            isSaving={isSaving}
                        />
                    ) : null}
                </div>
            )}
        </div>
    )
}

function PriceForm({
                       draft,
                       setDraft,
                       currencyOptions,
                       onCancel,
                       onSave,
                       isSaving,
                   }: {
    draft: PriceDraft
    setDraft: React.Dispatch<React.SetStateAction<PriceDraft>>
    currencyOptions: CurrencyOption[]
    onCancel: () => void
    onSave: () => void
    isSaving: boolean
}) {
    const selected =
        currencyOptions.find((option) => option.value === draft.currency) ??
        (draft.currency
            ? {value: draft.currency, label: draft.currency}
            : null)

    return (
        <div className="grid grid-cols-2 gap-2 rounded-md border border-dashed p-3 sm:grid-cols-5">
            <Field className="sm:col-span-2">
                <FieldLabel className="text-xs">Currency</FieldLabel>
                <FieldContent>
                    <Combobox
                        items={currencyOptions}
                        itemToStringValue={(item: CurrencyOption) => item.label}
                        value={selected}
                        onValueChange={(item: CurrencyOption | null) =>
                            setDraft((d) => ({
                                ...d,
                                currency: item?.value ?? "",
                            }))
                        }
                    >
                        <ComboboxInput placeholder="Select currency..."/>
                        <ComboboxContent>
                            <ComboboxEmpty>No currencies found.</ComboboxEmpty>
                            <ComboboxList>
                                {(item: CurrencyOption) => (
                                    <ComboboxItem key={item.value} value={item}>
                                        {item.label}
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                </FieldContent>
            </Field>
            <Field>
                <FieldLabel className="text-xs">Amount</FieldLabel>
                <FieldContent>
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={draft.amount}
                        onChange={(event) =>
                            setDraft((d) => ({...d, amount: event.target.value}))
                        }
                    />
                </FieldContent>
            </Field>
            <Field>
                <FieldLabel className="text-xs">Interval</FieldLabel>
                <FieldContent>
                    <NativeSelect
                        value={draft.billing_interval}
                        onChange={(event) =>
                            setDraft((d) => ({
                                ...d,
                                billing_interval: event.target.value as PlanPriceInterval,
                            }))
                        }
                    >
                        {intervalOptions.map((option) => (
                            <NativeSelectOption key={option.value} value={option.value}>
                                {option.label}
                            </NativeSelectOption>
                        ))}
                    </NativeSelect>
                </FieldContent>
            </Field>
            <Field>
                <FieldLabel className="text-xs">Trial days</FieldLabel>
                <FieldContent>
                    <Input
                        type="number"
                        min="0"
                        max="365"
                        value={draft.trial_days}
                        onChange={(event) =>
                            setDraft((d) => ({...d, trial_days: event.target.value}))
                        }
                    />
                </FieldContent>
            </Field>
            <Field>
                <FieldLabel className="text-xs">Status</FieldLabel>
                <FieldContent>
                    <NativeSelect
                        value={draft.status}
                        onChange={(event) =>
                            setDraft((d) => ({
                                ...d,
                                status: event.target.value as PriceDraft["status"],
                            }))
                        }
                    >
                        {statusOptions.map((option) => (
                            <NativeSelectOption key={option.value} value={option.value}>
                                {option.label}
                            </NativeSelectOption>
                        ))}
                    </NativeSelect>
                </FieldContent>
            </Field>
            <Field>
                <FieldLabel className="text-xs">Stripe price ID</FieldLabel>
                <FieldContent>
                    <Input
                        value={draft.stripe_id}
                        placeholder="price_..."
                        onChange={(event) =>
                            setDraft((d) => ({...d, stripe_id: event.target.value}))
                        }
                    />
                </FieldContent>
            </Field>
            <Field>
                <FieldLabel className="text-xs">Paystack plan code</FieldLabel>
                <FieldContent>
                    <Input
                        value={draft.paystack_id}
                        placeholder="PLN_..."
                        onChange={(event) =>
                            setDraft((d) => ({...d, paystack_id: event.target.value}))
                        }
                    />
                </FieldContent>
            </Field>
            <Field>
                <FieldLabel className="text-xs">Flutterwave plan ID</FieldLabel>
                <FieldContent>
                    <Input
                        value={draft.flutterwave_id}
                        onChange={(event) =>
                            setDraft((d) => ({
                                ...d,
                                flutterwave_id: event.target.value,
                            }))
                        }
                    />
                </FieldContent>
            </Field>
            <div className="col-span-full flex justify-end gap-2">
                <Button type="button" size="sm" variant="outline" onClick={onCancel}>
                    <XIcon className="size-4"/> Cancel
                </Button>
                <Button type="button" size="sm" onClick={onSave} disabled={isSaving}>
                    {isSaving ? <Spinner/> : null} Save
                </Button>
            </div>
        </div>
    )
}
