"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import * as React from "react"

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
import {
    ResponsiveDialog,
    ResponsiveDialogClose,
    ResponsiveDialogContent,
    ResponsiveDialogDescription,
    ResponsiveDialogFooter,
    ResponsiveDialogHeader,
    ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import {Spinner} from "@/components/ui/spinner"
import {useCountryOptions, useCurrencyOptions} from "@/features/central/world/hooks/use-world-query"
import {getPaymentGatewayOptions} from "@/lib/services/central/payment-gateway-service"
import {
    getTenantBillingProfile,
    updateTenantBillingProfile,
} from "@/lib/services/central/tenant-service"
import {toastApiError, toastApiSuccess} from "@/lib/toast-api"
import type {Tenant} from "@/types/central/tenant"
import type {CountryOption, CurrencyOption} from "@/types/central/world"

type TenantsViewDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    tenant: Tenant
}

type TenantBillingProfile = {
    country_iso2?: string | null
    currency?: string | null
    preferred_gateway?: string | null
}

function TenantBillingProfileForm({
    tenantId,
    profile,
    countries,
    currencies,
    gateways,
    onSaved,
}: {
    tenantId: number
    profile: TenantBillingProfile
    countries: CountryOption[]
    currencies: CurrencyOption[]
    gateways: Array<{ value: string; label: string }>
    onSaved: () => void
}) {
    const [country, setCountry] = React.useState(profile.country_iso2 ?? "")
    const [currency, setCurrency] = React.useState(profile.currency ?? "")
    const [gateway, setGateway] = React.useState(profile.preferred_gateway ?? "")

    const saveProfile = useMutation({
        mutationFn: () =>
            updateTenantBillingProfile(tenantId, {
                country_iso2: country || null,
                currency: currency || null,
                preferred_gateway: gateway || null,
            }),
        onSuccess: (result) => {
            toastApiSuccess(result.message, "Billing profile updated")
            onSaved()
        },
        onError: (error) => toastApiError(error, "Failed to update billing profile"),
    })

    const selectedCountry =
        countries.find((option: CountryOption) => option.value === country) ??
        (country ? {value: country, label: country} : null)
    const selectedCurrency =
        currencies.find((option: CurrencyOption) => option.value === currency) ??
        (currency ? {value: currency, label: currency} : null)
    const selectedGateway =
        gateways.find((option) => option.value === gateway) ??
        (gateway ? {value: gateway, label: gateway} : null)

    return (
        <div className="grid gap-3">
            <Field>
                <FieldLabel>Country</FieldLabel>
                <FieldContent>
                    <Combobox
                        items={countries}
                        itemToStringValue={(item: CountryOption) => item.label}
                        value={selectedCountry}
                        onValueChange={(item: CountryOption | null) =>
                            setCountry(item?.value ?? "")
                        }
                    >
                        <ComboboxInput placeholder="Select country..."/>
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
                </FieldContent>
            </Field>
            <Field>
                <FieldLabel>Currency</FieldLabel>
                <FieldContent>
                    <Combobox
                        items={currencies}
                        itemToStringValue={(item: CurrencyOption) => item.label}
                        value={selectedCurrency}
                        onValueChange={(item: CurrencyOption | null) =>
                            setCurrency(item?.value ?? "")
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
                <FieldLabel>Preferred gateway</FieldLabel>
                <FieldContent>
                    <Combobox
                        items={gateways}
                        itemToStringValue={(item) => item.label}
                        value={selectedGateway}
                        onValueChange={(item) =>
                            setGateway(item?.value ?? "")
                        }
                    >
                        <ComboboxInput placeholder="Optional preferred gateway..."/>
                        <ComboboxContent>
                            <ComboboxEmpty>No gateways found.</ComboboxEmpty>
                            <ComboboxList>
                                {(item) => (
                                    <ComboboxItem key={item.value} value={item}>
                                        {item.label}
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                </FieldContent>
            </Field>
            <div className="flex justify-end">
                <Button
                    type="button"
                    size="sm"
                    onClick={() => saveProfile.mutate()}
                    disabled={saveProfile.isPending}
                >
                    {saveProfile.isPending ? <Spinner/> : null}
                    Save billing profile
                </Button>
            </div>
        </div>
    )
}

export function TenantsViewDialog({
                                      open,
                                      onOpenChange,
                                      tenant,
                                  }: TenantsViewDialogProps) {
    const queryClient = useQueryClient()
    const {data: countries = []} = useCountryOptions()
    const {data: currencies = []} = useCurrencyOptions()
    const {data: gateways = []} = useQuery({
        queryKey: ["central", "payment-gateway-options"],
        queryFn: getPaymentGatewayOptions,
        enabled: open,
    })
    const {data: profile, isLoading: profileLoading} = useQuery({
        queryKey: ["central", "tenants", tenant.id, "billing-profile"],
        queryFn: () => getTenantBillingProfile(tenant.id),
        enabled: open,
    })

    const profileFormKey = profile
        ? `${profile.country_iso2 ?? ""}-${profile.currency ?? ""}-${profile.preferred_gateway ?? ""}`
        : null

    const rows = [
        ["Name", tenant.name],
        ["Slug", tenant.slug],
        ["Email", tenant.email || "—"],
        ["Phone", tenant.phone || "—"],
        ["Domains", String(tenant.domains_count ?? tenant.domains?.length ?? 0)],
        [
            "Trial ends",
            tenant.trial_ends_at
                ? new Date(tenant.trial_ends_at).toLocaleString()
                : "—",
        ],
        ["Created", tenant.created_at_human ?? new Date(tenant.created_at).toLocaleString()],
    ] as const

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="sm:max-w-lg">
                <ResponsiveDialogHeader>
                    <ResponsiveDialogTitle>Tenant details</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Overview and billing preferences for {tenant.name}.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <div className="max-h-[65vh] space-y-3 overflow-y-auto pe-1 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Status</span>
                        <Badge className="capitalize">
                            {tenant.status_label ?? tenant.status.replaceAll("_", " ")}
                        </Badge>
                    </div>
                    {rows.map(([label, value]) => (
                        <div
                            key={label}
                            className="flex items-start justify-between gap-4 border-b pb-2 last:border-b-0"
                        >
                            <span className="text-muted-foreground">{label}</span>
                            <span className="text-end font-medium">{value}</span>
                        </div>
                    ))}

                    <div className="flex flex-col gap-3 rounded-lg border p-3">
                        <div>
                            <p className="font-medium">Billing profile</p>
                            <p className="text-muted-foreground">
                                Preferred country, currency, and gateway for plan pricing
                                and checkout resolution.
                            </p>
                        </div>
                        {profileLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Spinner/> Loading profile...
                            </div>
                        ) : profile && profileFormKey ? (
                            <TenantBillingProfileForm
                                key={profileFormKey}
                                tenantId={tenant.id}
                                profile={profile}
                                countries={countries}
                                currencies={currencies}
                                gateways={gateways}
                                onSaved={() => {
                                    queryClient.invalidateQueries({
                                        queryKey: [
                                            "central",
                                            "tenants",
                                            tenant.id,
                                            "billing-profile",
                                        ],
                                    })
                                }}
                            />
                        ) : null}
                    </div>
                </div>

                <ResponsiveDialogFooter>
                    <ResponsiveDialogClose
                        render={<Button variant="outline">Close</Button>}
                    />
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}
