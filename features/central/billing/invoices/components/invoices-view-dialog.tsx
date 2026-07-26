"use client"

import {PrinterIcon} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    ResponsiveDialog,
    ResponsiveDialogClose,
    ResponsiveDialogContent,
    ResponsiveDialogDescription,
    ResponsiveDialogFooter,
    ResponsiveDialogHeader,
    ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import {InvoiceDocument} from "@/features/central/billing/invoices/components/invoice-document"
import type {Invoice} from "@/features/central/billing/invoices/types"

type InvoicesViewDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    invoice: Invoice
}

export function InvoicesViewDialog({
                                       open,
                                       onOpenChange,
                                       invoice,
                                   }: InvoicesViewDialogProps) {
    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-3xl">
                <ResponsiveDialogHeader className="invoice-no-print border-b p-4">
                    <ResponsiveDialogTitle>Invoice {invoice.number}</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription>
                        Preview and print the invoice document.
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>

                <InvoiceDocument invoice={invoice}/>

                <ResponsiveDialogFooter className="invoice-no-print border-t p-4">
                    <ResponsiveDialogClose
                        render={<Button variant="outline">Close</Button>}
                    />
                    <Button onClick={() => window.print()}>
                        <PrinterIcon/>
                        Print
                    </Button>
                </ResponsiveDialogFooter>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    )
}
