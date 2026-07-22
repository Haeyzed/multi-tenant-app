"use client"


import {zodResolver} from "@hookform/resolvers/zod"

import {useQuery} from "@tanstack/react-query"

import * as React from "react"

import {Controller, useForm} from "react-hook-form"


import {Button} from "@/components/ui/button"

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"

import {Field, FieldContent, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/field"

import {Input} from "@/components/ui/input"

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

import {useInvoices} from "@/features/central/billing/invoices/components/invoices-provider"

import {InvoicesFormDialog} from "@/features/central/billing/invoices/components/invoices-form-dialog"

import {InvoicesViewDialog} from "@/features/central/billing/invoices/components/invoices-view-dialog"

import {
    useChargeInvoice,
    useSendInvoicePaymentLink,
    useVoidInvoice,
} from "@/features/central/billing/invoices/hooks/use-invoice-query"

import {type ChargeInvoiceFormValues, chargeInvoiceSchema,} from "@/features/central/billing/invoices/schemas"

import {getPaymentGatewayOptions} from "@/lib/services/central/payment-gateway-service"

import {toastApiError, toastApiSuccess} from "@/lib/toast-api"


type Option = { label: string; value: string }


export function InvoicesDialogs() {

    const {open, setOpen, currentRow, setCurrentRow} = useInvoices()

    const voidInvoice = useVoidInvoice()

    const chargeInvoice = useChargeInvoice()

    const sendPaymentLink = useSendInvoicePaymentLink()


    const chargeForm = useForm<ChargeInvoiceFormValues>({

        resolver: zodResolver(chargeInvoiceSchema),

        defaultValues: {gateway: "", amount: undefined},

    })


    const {data: gatewayOptions = []} = useQuery({

        queryKey: ["central", "payment-gateways", "options"],

        queryFn: () => getPaymentGatewayOptions(),

        enabled: open === "charge",

    })


    const handleClose = React.useCallback(() => {

        setOpen(null)

        setTimeout(() => {

            setCurrentRow(null)

            chargeForm.reset({gateway: "", amount: undefined})

        }, 300)

    }, [setOpen, setCurrentRow, chargeForm])


    const runSendLink = () => {

        if (!currentRow) {

            return

        }


        sendPaymentLink.mutate(
            {id: currentRow.id},

            {

                onSuccess: (result) => {

                    toastApiSuccess(
                        result.message,

                        `Payment link sent to ${result.data.email}`
                    )

                    handleClose()

                },

                onError: (error) => {

                    toastApiError(error, "Failed to send payment link")

                },

            }
        )

    }


    const runVoid = () => {

        if (!currentRow) {

            return

        }


        voidInvoice.mutate(currentRow.id, {

            onSuccess: (result) => {

                toastApiSuccess(
                    result.message,

                    `Invoice ${currentRow.number} voided successfully`
                )

                handleClose()

            },

            onError: (error) => {

                toastApiError(error, "Failed to void invoice")

            },

        })

    }


    const onChargeSubmit = (values: ChargeInvoiceFormValues) => {

        if (!currentRow) {

            return

        }


        chargeInvoice.mutate(
            {

                id: currentRow.id,

                values: {

                    gateway: values.gateway || undefined,

                    amount: values.amount || undefined,

                },

            },

            {

                onSuccess: (result) => {

                    toastApiSuccess(result.message, "Invoice charged successfully")

                    if (result.data.checkout_url) {

                        window.open(result.data.checkout_url, "_blank", "noopener,noreferrer")

                    }

                    handleClose()

                },

                onError: (error) => {

                    toastApiError(error, "Failed to charge invoice")

                },

            }
        )

    }


    return (

        <>

            <InvoicesFormDialog

                open={open === "create"}

                onOpenChange={(val) => {

                    if (!val) {

                        setOpen(null)

                    }

                }}

            />


            {currentRow ? (

                <>

                    <InvoicesViewDialog

                        key={`invoice-view-${currentRow.id}`}

                        open={open === "view"}

                        onOpenChange={(val) => {

                            if (!val) {

                                handleClose()

                            }

                        }}

                        invoice={currentRow}

                    />


                    <ResponsiveDialog

                        open={open === "send-link"}

                        onOpenChange={(val) => !val && handleClose()}

                    >

                        <ResponsiveDialogContent className="sm:max-w-md">

                            <ResponsiveDialogHeader>

                                <ResponsiveDialogTitle>Send payment link</ResponsiveDialogTitle>

                                <ResponsiveDialogDescription>

                                    Email a signed payment link for invoice{" "}

                                    <strong>{currentRow.number}</strong> to the tenant owner.

                                </ResponsiveDialogDescription>

                            </ResponsiveDialogHeader>

                            <ResponsiveDialogFooter>

                                <ResponsiveDialogClose

                                    render={<Button variant="outline">Cancel</Button>}

                                />

                                <Button

                                    disabled={sendPaymentLink.isPending}

                                    onClick={runSendLink}

                                >

                                    {sendPaymentLink.isPending ? <Spinner/> : null}

                                    Send link

                                </Button>

                            </ResponsiveDialogFooter>

                        </ResponsiveDialogContent>

                    </ResponsiveDialog>


                    <ResponsiveDialog

                        open={open === "void"}

                        onOpenChange={(val) => !val && handleClose()}

                    >

                        <ResponsiveDialogContent className="sm:max-w-md">

                            <ResponsiveDialogHeader>

                                <ResponsiveDialogTitle>Void invoice</ResponsiveDialogTitle>

                                <ResponsiveDialogDescription>

                                    Void invoice <strong>{currentRow.number}</strong>? This

                                    cannot be undone.

                                </ResponsiveDialogDescription>

                            </ResponsiveDialogHeader>

                            <ResponsiveDialogFooter>

                                <ResponsiveDialogClose

                                    render={<Button variant="outline">Cancel</Button>}

                                />

                                <Button

                                    variant="destructive"

                                    disabled={voidInvoice.isPending}

                                    onClick={runVoid}

                                >

                                    {voidInvoice.isPending ? <Spinner/> : null}

                                    Void

                                </Button>

                            </ResponsiveDialogFooter>

                        </ResponsiveDialogContent>

                    </ResponsiveDialog>


                    <ResponsiveDialog

                        open={open === "charge"}

                        onOpenChange={(val) => !val && handleClose()}

                    >

                        <ResponsiveDialogContent className="sm:max-w-md">

                            <ResponsiveDialogHeader>

                                <ResponsiveDialogTitle>Charge invoice</ResponsiveDialogTitle>

                                <ResponsiveDialogDescription>

                                    Attempt to charge invoice <strong>{currentRow.number}</strong>{" "}

                                    through a payment gateway.

                                </ResponsiveDialogDescription>

                            </ResponsiveDialogHeader>


                            <form

                                id="charge-invoice-form"

                                className="space-y-4"

                                onSubmit={chargeForm.handleSubmit(onChargeSubmit)}

                            >

                                <FieldGroup>

                                    <Field>

                                        <FieldLabel>Gateway</FieldLabel>

                                        <FieldContent>

                                            <Controller

                                                control={chargeForm.control}

                                                name="gateway"

                                                render={({field}) => {

                                                    const selected =

                                                        gatewayOptions.find(
                                                            (option) => option.value === field.value
                                                        ) ?? null

                                                    return (

                                                        <Combobox

                                                            items={gatewayOptions}

                                                            itemToStringValue={(item: Option) => item.label}

                                                            value={selected}

                                                            onValueChange={(item: Option | null) =>

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

                                                                    {(item: Option) => (

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

                                                placeholder={String(currentRow.balance_due)}

                                                {...chargeForm.register("amount")}

                                            />

                                            <FieldError

                                                errors={

                                                    chargeForm.formState.errors.amount

                                                        ? [chargeForm.formState.errors.amount]

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

                                    {chargeInvoice.isPending ? <Spinner/> : null}

                                    Charge

                                </Button>

                            </ResponsiveDialogFooter>

                        </ResponsiveDialogContent>

                    </ResponsiveDialog>

                </>

            ) : null}

        </>

    )

}


