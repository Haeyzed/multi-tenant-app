"use client"

import * as React from "react"
import Link from "next/link"
import {useRouter} from "next/navigation"

import {Button, buttonVariants} from "@/components/ui/button"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import {Field, FieldContent, FieldLabel} from "@/components/ui/field"
import {Spinner} from "@/components/ui/spinner"
import {InvoiceDocument} from "@/features/central/billing/invoices/components/invoice-document"
import {centralRoutes} from "@/features/central/shell/routes"
import {
    getPublicInvoice,
    payPublicInvoice,
    type PublicInvoiceGatewayOption,
} from "@/lib/services/central/public-billing-service"
import {cn} from "@/lib/utils"
import type {Invoice} from "@/types/central/invoice"

type PublicInvoiceClientProps = {
    invoiceId: number
    expires: string | null
    signature: string | null
}

type GatewayOption = { label: string; value: string }

type PageState =
    | { status: "loading" }
    | {
    status: "ready"
    invoice: Invoice
    gateways: PublicInvoiceGatewayOption[]
    canPay: boolean
}
    | { status: "paying" }
    | { status: "redirecting" }
    | { status: "error"; message: string }

export function PublicInvoiceClient({
                                        invoiceId,
                                        expires,
                                        signature,
                                    }: PublicInvoiceClientProps) {
    const router = useRouter()
    const [state, setState] = React.useState<PageState>({status: "loading"})
    const [gateway, setGateway] = React.useState<string>("")
    const loaded = React.useRef(false)

    React.useEffect(() => {
        if (loaded.current) {
            return
        }
        loaded.current = true

        if (!expires || !signature) {
            setState({
                status: "error",
                message: "This invoice link is missing a valid signature.",
            })
            return
        }

        getPublicInvoice(invoiceId, {expires, signature})
            .then((result) => {
                const recommended =
                    result.gateways.find((option) => option.recommended)?.value ??
                    result.gateways[0]?.value ??
                    ""
                setGateway(recommended)
                setState({
                    status: "ready",
                    invoice: result.invoice,
                    gateways: result.gateways,
                    canPay: result.can_pay,
                })
            })
            .catch((error: unknown) => {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Unable to load this invoice. The link may have expired."
                setState({status: "error", message})
            })
    }, [expires, invoiceId, signature])

    const onPay = () => {
        if (!expires || !signature || !gateway || state.status !== "ready") {
            return
        }

        setState({status: "paying"})

        payPublicInvoice(invoiceId, gateway, {expires, signature})
            .then((result) => {
                if (result.completed) {
                    router.replace(
                        `${centralRoutes.billing.success}?payment=${result.payment_id}`
                    )
                    return
                }

                if (result.checkout_url) {
                    setState({status: "redirecting"})
                    window.location.assign(result.checkout_url)
                    return
                }

                setState({
                    status: "error",
                    message: "The payment gateway did not return a checkout URL.",
                })
            })
            .catch((error: unknown) => {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Unable to start payment. The link may have expired."
                setState({status: "error", message})
            })
    }

    if (state.status === "error") {
        return (
            <div className="space-y-4 text-center">
                <h1 className="text-xl font-semibold">Invoice unavailable</h1>
                <p className="text-muted-foreground text-sm">{state.message}</p>
                <Link
                    href={centralRoutes.login}
                    className={cn(buttonVariants({variant: "default"}))}
                >
                    Go to login
                </Link>
            </div>
        )
    }

    if (
        state.status === "loading" ||
        state.status === "paying" ||
        state.status === "redirecting"
    ) {
        return (
            <div className="flex flex-col items-center gap-3 text-center">
                <Spinner className="size-6"/>
                <h1 className="text-xl font-semibold">
                    {state.status === "redirecting"
                        ? "Redirecting to payment…"
                        : state.status === "paying"
                            ? "Starting payment…"
                            : "Loading invoice…"}
                </h1>
            </div>
        )
    }

    const gatewayOptions: GatewayOption[] = state.gateways.map((option) => ({
        value: option.value,
        label: option.recommended
            ? `${option.label} (recommended)`
            : option.label,
    }))
    const selected =
        gatewayOptions.find((option) => option.value === gateway) ?? null

    return (
        <div className="flex w-full flex-col gap-6">
            <InvoiceDocument invoice={state.invoice}/>

            {state.canPay ? (
                <div className="bg-card flex flex-col gap-4 rounded-lg border p-4 shadow-sm">
                    <div className="space-y-1">
                        <h2 className="text-base font-semibold">Pay this invoice</h2>
                        <p className="text-muted-foreground text-sm">
                            Choose a payment provider that supports {state.invoice.currency}.
                        </p>
                    </div>

                    <Field>
                        <FieldLabel>Payment provider</FieldLabel>
                        <FieldContent>
                            <Combobox
                                items={gatewayOptions}
                                itemToStringValue={(item: GatewayOption) => item.label}
                                value={selected}
                                onValueChange={(item: GatewayOption | null) =>
                                    setGateway(item?.value ?? "")
                                }
                            >
                                <ComboboxInput placeholder="Select a provider..."/>
                                <ComboboxContent>
                                    <ComboboxEmpty>No providers available.</ComboboxEmpty>
                                    <ComboboxList>
                                        {(item: GatewayOption) => (
                                            <ComboboxItem key={item.value} value={item}>
                                                {item.label}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </FieldContent>
                    </Field>

                    <Button
                        type="button"
                        disabled={!gateway || state.gateways.length === 0}
                        onClick={onPay}
                    >
                        Pay now
                    </Button>
                </div>
            ) : (
                <p className="text-muted-foreground text-center text-sm">
                    This invoice does not require payment right now.
                </p>
            )}
        </div>
    )
}
