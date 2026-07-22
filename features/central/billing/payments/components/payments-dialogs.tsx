"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import * as React from "react"
import {useForm} from "react-hook-form"

import {Button} from "@/components/ui/button"
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
import {Textarea} from "@/components/ui/textarea"
import {usePayments} from "@/features/central/billing/payments/components/payments-provider"
import {PaymentsViewDialog} from "@/features/central/billing/payments/components/payments-view-dialog"
import {useRefundPayment} from "@/features/central/billing/payments/hooks/use-payment-query"
import {type RefundPaymentFormValues, refundPaymentSchema,} from "@/features/central/billing/payments/schemas"
import {toastApiError, toastApiSuccess} from "@/lib/toast-api"

export function PaymentsDialogs() {
    const {open, setOpen, currentRow, setCurrentRow} = usePayments()
    const refundPayment = useRefundPayment()

    const refundForm = useForm<RefundPaymentFormValues>({
        resolver: zodResolver(refundPaymentSchema),
        defaultValues: {amount: undefined, reason: ""},
    })

    const handleClose = React.useCallback(() => {
        setOpen(null)
        setTimeout(() => {
            setCurrentRow(null)
            refundForm.reset({amount: undefined, reason: ""})
        }, 300)
    }, [setOpen, setCurrentRow, refundForm])

    const onRefundSubmit = (values: RefundPaymentFormValues) => {
        if (!currentRow) {
            return
        }

        refundPayment.mutate(
            {
                id: currentRow.id,
                values: {
                    amount: values.amount || undefined,
                    reason: values.reason || undefined,
                },
            },
            {
                onSuccess: (result) => {
                    toastApiSuccess(result.message, "Refund processed successfully")
                    handleClose()
                },
                onError: (error) => {
                    toastApiError(error, "Failed to process refund")
                },
            }
        )
    }

    return (
        <>
            {currentRow ? (
                <>
                    <PaymentsViewDialog
                        key={`payment-view-${currentRow.id}`}
                        open={open === "view"}
                        onOpenChange={(val) => {
                            if (!val) {
                                handleClose()
                            }
                        }}
                        payment={currentRow}
                    />

                    <ResponsiveDialog
                        open={open === "refund"}
                        onOpenChange={(val) => !val && handleClose()}
                    >
                        <ResponsiveDialogContent className="sm:max-w-md">
                            <ResponsiveDialogHeader>
                                <ResponsiveDialogTitle>Refund payment</ResponsiveDialogTitle>
                                <ResponsiveDialogDescription>
                                    Refund payment #{currentRow.id}. Leave amount blank to
                                    refund in full.
                                </ResponsiveDialogDescription>
                            </ResponsiveDialogHeader>

                            <form
                                id="refund-payment-form"
                                className="space-y-4"
                                onSubmit={refundForm.handleSubmit(onRefundSubmit)}
                            >
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel>Amount (optional)</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                placeholder={String(currentRow.amount)}
                                                {...refundForm.register("amount")}
                                            />
                                            <FieldError
                                                errors={
                                                    refundForm.formState.errors.amount
                                                        ? [refundForm.formState.errors.amount]
                                                        : []
                                                }
                                            />
                                        </FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Reason (optional)</FieldLabel>
                                        <FieldContent>
                                            <Textarea
                                                {...refundForm.register("reason")}
                                                placeholder="Customer requested refund"
                                                rows={3}
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
                                    form="refund-payment-form"
                                    variant="destructive"
                                    disabled={refundPayment.isPending}
                                >
                                    {refundPayment.isPending ? <Spinner/> : null}
                                    Refund
                                </Button>
                            </ResponsiveDialogFooter>
                        </ResponsiveDialogContent>
                    </ResponsiveDialog>
                </>
            ) : null}
        </>
    )
}
