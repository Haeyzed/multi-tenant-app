"use client"

import {PlusIcon, Trash2Icon} from "lucide-react"
import * as React from "react"

import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Checkbox} from "@/components/ui/checkbox"
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
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {useCurrencyOptions} from "@/features/central/world/hooks/use-world-query"
import type {Setting} from "@/types/central/setting"
import type {CurrencyOption} from "@/types/central/world"

const GATEWAYS = ["paystack", "flutterwave", "stripe"] as const

type Gateway = (typeof GATEWAYS)[number]
type ProviderCurrencies = Record<Gateway, string[]>
type GatewayMap = Record<string, Gateway>
type AmountMap = Record<string, number>
type MinimumMap = Record<Gateway, AmountMap>

const SETTING_KEYS = {
    providers: "billing.provider_currencies",
    routes: "billing.gateway_by_currency",
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
                                               settings,
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

    const providerCurrencies = parseMap<ProviderCurrencies>(
        values[SETTING_KEYS.providers],
        {paystack: [], flutterwave: [], stripe: []}
    )
    const gatewayMap = parseMap<GatewayMap>(values[SETTING_KEYS.routes], {})
    const amounts = parseMap<AmountMap>(values[SETTING_KEYS.amounts], {})
    const minimums = parseMap<MinimumMap>(values[SETTING_KEYS.minimums], {
        paystack: {},
        flutterwave: {},
        stripe: {},
    })

    const providerSetting = settings.find(
        (setting) => setting.key === SETTING_KEYS.providers
    )
    const capabilities =
        providerSetting?.options &&
        typeof providerSetting.options === "object" &&
        !Array.isArray(providerSetting.options)
            ? (providerSetting.options as Record<string, string[]>)
            : {}

    const currencies = Array.from(
        new Set([
            ...Object.keys(gatewayMap),
            ...Object.keys(amounts),
            ...GATEWAYS.flatMap((gateway) => providerCurrencies[gateway] ?? []),
        ])
    ).sort()

    const saveMaps = (
        nextProviders: ProviderCurrencies,
        nextRoutes: GatewayMap,
        nextAmounts: AmountMap,
        nextMinimums: MinimumMap
    ) => {
        onChange(SETTING_KEYS.providers, JSON.stringify(nextProviders, null, 2))
        onChange(SETTING_KEYS.routes, JSON.stringify(nextRoutes, null, 2))
        onChange(SETTING_KEYS.amounts, JSON.stringify(nextAmounts, null, 2))
        onChange(SETTING_KEYS.minimums, JSON.stringify(nextMinimums, null, 2))
    }

    const supports = (gateway: Gateway, currency: string): boolean => {
        const supported = capabilities[gateway] ?? []
        return supported.includes("*") || supported.includes(currency)
    }

    const addCurrency = () => {
        if (!pendingCurrency || currencies.includes(pendingCurrency.value)) {
            return
        }

        const currency = pendingCurrency.value.toUpperCase()
        const supportedGateways = GATEWAYS.filter((gateway) =>
            supports(gateway, currency)
        )
        const nextProviders = structuredClone(providerCurrencies)
        const nextRoutes = {...gatewayMap}
        const nextAmounts = {...amounts, [currency]: amounts[currency] ?? 1}

        for (const gateway of supportedGateways) {
            nextProviders[gateway] = Array.from(
                new Set([...(nextProviders[gateway] ?? []), currency])
            ).sort()
        }

        if (supportedGateways.length > 0) {
            nextRoutes[currency] = supportedGateways[0]
        }

        saveMaps(nextProviders, nextRoutes, nextAmounts, minimums)
        setPendingCurrency(null)
    }

    const removeCurrency = (currency: string) => {
        const nextProviders = structuredClone(providerCurrencies)
        const nextMinimums = structuredClone(minimums)

        for (const gateway of GATEWAYS) {
            nextProviders[gateway] = (nextProviders[gateway] ?? []).filter(
                (code) => code !== currency
            )
            delete nextMinimums[gateway]?.[currency]
        }

        const nextRoutes = {...gatewayMap}
        const nextAmounts = {...amounts}
        delete nextRoutes[currency]
        delete nextAmounts[currency]

        saveMaps(nextProviders, nextRoutes, nextAmounts, nextMinimums)
    }

    const toggleProvider = (
        currency: string,
        gateway: Gateway,
        checked: boolean
    ) => {
        const nextProviders = structuredClone(providerCurrencies)
        const enabled = new Set(nextProviders[gateway] ?? [])

        if (checked) {
            enabled.add(currency)
        } else {
            enabled.delete(currency)
        }

        nextProviders[gateway] = Array.from(enabled).sort()

        const nextRoutes = {...gatewayMap}
        const enabledForCurrency = GATEWAYS.filter((provider) =>
            (nextProviders[provider] ?? []).includes(currency)
        )

        if (!enabledForCurrency.includes(nextRoutes[currency])) {
            if (enabledForCurrency.length > 0) {
                nextRoutes[currency] = enabledForCurrency[0]
            } else {
                delete nextRoutes[currency]
            }
        }

        saveMaps(nextProviders, nextRoutes, amounts, minimums)
    }

    const updateMinimum = (currency: string, gateway: Gateway, value: string) => {
        const nextMinimums = structuredClone(minimums)
        nextMinimums[gateway] ??= {}
        nextMinimums[gateway][currency] = numberValue(value)
        saveMaps(providerCurrencies, gatewayMap, amounts, nextMinimums)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Multi-currency payment policy</CardTitle>
                <CardDescription>
                    Control which providers accept each currency, the recommended route,
                    and the refundable card-verification amount.
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
                        Add a currency to configure payment routing.
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {currencies.map((currency) => {
                            const enabledGateways = GATEWAYS.filter((gateway) =>
                                (providerCurrencies[gateway] ?? []).includes(currency)
                            )

                            return (
                                <Card key={currency} size="sm">
                                    <CardHeader className="flex-row items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <CardTitle>{currency}</CardTitle>
                                            <Badge variant="outline">
                                                {enabledGateways.length} provider
                                                {enabledGateways.length === 1 ? "" : "s"}
                                            </Badge>
                                        </div>
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
                                                <FieldLabel>Enabled providers</FieldLabel>
                                                <FieldContent>
                                                    <div className="flex flex-wrap gap-4">
                                                        {GATEWAYS.map((gateway) => {
                                                            const supported = supports(gateway, currency)
                                                            const enabled = (
                                                                providerCurrencies[gateway] ?? []
                                                            ).includes(currency)

                                                            return (
                                                                <Field
                                                                    key={gateway}
                                                                    orientation="horizontal"
                                                                    data-disabled={!supported || undefined}
                                                                >
                                                                    <Checkbox
                                                                        id={`${currency}-${gateway}`}
                                                                        checked={enabled}
                                                                        disabled={!supported}
                                                                        onCheckedChange={(checked) =>
                                                                            toggleProvider(
                                                                                currency,
                                                                                gateway,
                                                                                checked === true
                                                                            )
                                                                        }
                                                                    />
                                                                    <FieldLabel
                                                                        htmlFor={`${currency}-${gateway}`}
                                                                    >
                                                                        {gatewayLabel(gateway)}
                                                                    </FieldLabel>
                                                                </Field>
                                                            )
                                                        })}
                                                    </div>
                                                    <FieldDescription>
                                                        Unsupported provider/currency combinations are
                                                        disabled by server capabilities.
                                                    </FieldDescription>
                                                </FieldContent>
                                            </Field>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                <Field>
                                                    <FieldLabel>Recommended provider</FieldLabel>
                                                    <FieldContent>
                                                        <Select
                                                            value={gatewayMap[currency] ?? null}
                                                            onValueChange={(gateway) =>
                                                                saveMaps(
                                                                    providerCurrencies,
                                                                    {
                                                                        ...gatewayMap,
                                                                        [currency]: gateway as Gateway,
                                                                    },
                                                                    amounts,
                                                                    minimums
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger
                                                                className="w-full"
                                                                disabled={enabledGateways.length === 0}
                                                            >
                                                                <SelectValue placeholder="Select provider"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    {enabledGateways.map((gateway) => (
                                                                        <SelectItem key={gateway} value={gateway}>
                                                                            {gatewayLabel(gateway)}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                    </FieldContent>
                                                </Field>

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
                                                                    providerCurrencies,
                                                                    gatewayMap,
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
                                            </div>

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
                                                                        disabled={
                                                                            !(
                                                                                providerCurrencies[gateway] ?? []
                                                                            ).includes(currency)
                                                                        }
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
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
