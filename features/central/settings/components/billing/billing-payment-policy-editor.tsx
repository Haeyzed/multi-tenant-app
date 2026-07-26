"use client"

import {PlusIcon, Trash2Icon} from "lucide-react"
import * as React from "react"

import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import {Field, FieldContent, FieldDescription, FieldGroup, FieldLabel,} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {useCurrencyOptions} from "@/features/central/world/hooks/use-world-query"
import type {Setting} from "@/features/central/settings/types"
import type {CurrencyOption} from "@/features/central/world/types"

const GATEWAYS = ["paystack", "flutterwave", "stripe"] as const

type Gateway = (typeof GATEWAYS)[number]
type AmountMap = Record<string, number>
type MinimumMap = Record<Gateway, AmountMap>

const SETTING_KEYS = {
    amounts: "billing.card_verification_amounts",
    minimums: "billing.card_verification_minimums",
} as const

function gatewayLabel(gateway: Gateway): string {
    return {
        paystack: "Paystack",
        flutterwave: "Flutterwave",
        stripe: "Stripe",
    }[gateway]
}

function parseMap<T>(value: string | boolean | undefined, fallback: T): T {
    if (typeof value !== "string" || value.trim() === "") {
        return fallback
    }

    try {
        const parsed = JSON.parse(value)
        return parsed && typeof parsed === "object" ? (parsed as T) : fallback
    } catch {
        return fallback
    }
}

function numberValue(value: string): number {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

export function BillingPaymentPolicyEditor({
                                               values,
                                               onChange,
                                           }: {
    settings: Setting[]
    values: Record<string, string | boolean>
    onChange: (key: string, value: string) => void
}) {
    const {data: currencyOptions = [], isLoading} = useCurrencyOptions()
    const [pendingCurrency, setPendingCurrency] =
        React.useState<CurrencyOption | null>(null)

    const amounts = parseMap<AmountMap>(values[SETTING_KEYS.amounts], {})
    const minimums = parseMap<MinimumMap>(values[SETTING_KEYS.minimums], {
        paystack: {},
        flutterwave: {},
        stripe: {},
    })

    const currencies = Array.from(
        new Set([
            ...Object.keys(amounts),
            ...GATEWAYS.flatMap((gateway) => Object.keys(minimums[gateway] ?? {})),
        ])
    ).sort()

    const saveMaps = (nextAmounts: AmountMap, nextMinimums: MinimumMap) => {
        onChange(SETTING_KEYS.amounts, JSON.stringify(nextAmounts, null, 2))
        onChange(SETTING_KEYS.minimums, JSON.stringify(nextMinimums, null, 2))
    }

    const addCurrency = () => {
        if (!pendingCurrency || currencies.includes(pendingCurrency.value)) {
            return
        }

        const currency = pendingCurrency.value.toUpperCase()
        const nextAmounts = {...amounts, [currency]: amounts[currency] ?? 1}
        const nextMinimums = structuredClone(minimums)

        for (const gateway of GATEWAYS) {
            if (gateway === "stripe") {
                continue
            }
            nextMinimums[gateway] ??= {}
            nextMinimums[gateway][currency] = nextMinimums[gateway][currency] ?? 0.01
        }

        saveMaps(nextAmounts, nextMinimums)
        setPendingCurrency(null)
    }

    const removeCurrency = (currency: string) => {
        const nextAmounts = {...amounts}
        const nextMinimums = structuredClone(minimums)
        delete nextAmounts[currency]

        for (const gateway of GATEWAYS) {
            delete nextMinimums[gateway]?.[currency]
        }

        saveMaps(nextAmounts, nextMinimums)
    }

    const updateMinimum = (currency: string, gateway: Gateway, value: string) => {
        const nextMinimums = structuredClone(minimums)
        nextMinimums[gateway] ??= {}
        nextMinimums[gateway][currency] = numberValue(value)
        saveMaps(amounts, nextMinimums)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Card verification amounts</CardTitle>
                <CardDescription>
                    Soft card-check amounts used at signup. Gateway routing is handled by
                    the payment gateways catalog (country/currency priority and fallback).
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Field>
                    <FieldLabel>Add currency</FieldLabel>
                    <FieldContent>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Combobox
                                items={currencyOptions.filter(
                                    (option) => !currencies.includes(option.value)
                                )}
                                itemToStringValue={(item: CurrencyOption) => item.label}
                                value={pendingCurrency}
                                onValueChange={setPendingCurrency}
                            >
                                <ComboboxInput
                                    className="min-w-0 flex-1"
                                    placeholder={
                                        isLoading ? "Loading currencies..." : "Select currency..."
                                    }
                                    disabled={isLoading}
                                />
                                <ComboboxContent>
                                    <ComboboxEmpty>No currencies available.</ComboboxEmpty>
                                    <ComboboxList>
                                        {(item: CurrencyOption) => (
                                            <ComboboxItem key={item.value} value={item}>
                                                {item.label}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={!pendingCurrency}
                                onClick={addCurrency}
                            >
                                <PlusIcon data-icon="inline-start"/>
                                Add currency
                            </Button>
                        </div>
                    </FieldContent>
                </Field>

                {currencies.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Add a currency to configure verification amounts.
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {currencies.map((currency) => (
                            <Card key={currency} size="sm">
                                <CardHeader className="flex-row items-center justify-between gap-3">
                                    <CardTitle>{currency}</CardTitle>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        aria-label={`Remove ${currency}`}
                                        onClick={() => removeCurrency(currency)}
                                    >
                                        <Trash2Icon/>
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel>Verification amount</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={amounts[currency] ?? 0}
                                                    onChange={(event) =>
                                                        saveMaps(
                                                            {
                                                                ...amounts,
                                                                [currency]: numberValue(event.target.value),
                                                            },
                                                            minimums
                                                        )
                                                    }
                                                />
                                                <FieldDescription>
                                                    Refunded after verification. Stripe uses a
                                                    zero-charge setup.
                                                </FieldDescription>
                                            </FieldContent>
                                        </Field>

                                        <Field>
                                            <FieldLabel>Provider minimums</FieldLabel>
                                            <FieldContent>
                                                <div className="grid gap-3 sm:grid-cols-3">
                                                    {GATEWAYS.map((gateway) => (
                                                        <Field key={gateway}>
                                                            <FieldLabel>{gatewayLabel(gateway)}</FieldLabel>
                                                            {gateway === "stripe" ? (
                                                                <Badge variant="secondary">
                                                                    Zero-charge setup
                                                                </Badge>
                                                            ) : (
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    step="0.01"
                                                                    value={
                                                                        minimums[gateway]?.[currency] ?? 0.01
                                                                    }
                                                                    onChange={(event) =>
                                                                        updateMinimum(
                                                                            currency,
                                                                            gateway,
                                                                            event.target.value
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                        </Field>
                                                    ))}
                                                </div>
                                            </FieldContent>
                                        </Field>
                                    </FieldGroup>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
