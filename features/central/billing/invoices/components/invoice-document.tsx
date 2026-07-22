"use client"

/* eslint-disable @next/next/no-img-element */
import {Badge} from "@/components/ui/badge"
import {formatMoney} from "@/features/central/dashboard/lib/format"
import {useInvoiceSettings} from "@/features/central/settings/hooks/use-setting-query"
import {cn} from "@/lib/utils"
import type {Invoice, InvoiceStatus} from "@/types/central/invoice"

type InvoiceDocumentProps = {
    invoice: Invoice
}

const statusVariantMap: Record<
    InvoiceStatus,
    React.ComponentProps<typeof Badge>["variant"]
> = {
    draft: "outline",
    open: "secondary",
    paid: "secondary",
    uncollectible: "destructive",
    void: "outline",
    pending: "outline",
    overdue: "destructive",
}

function formatDate(value: string | null): string {
    if (!value) {
        return "—"
    }
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString()
}

export function InvoiceDocument({invoice}: InvoiceDocumentProps) {
    const {settings} = useInvoiceSettings()
    const money = (value: string | number) =>
        formatMoney(Number(value), invoice.currency, "en-US")

    const companyName = settings.company_name ?? "Your Company"
    const displayNumber = invoice.number

    return (
        <div
            id="invoice-print"
            className="flex flex-col gap-6 bg-white p-6 text-sm text-zinc-900 sm:p-8 dark:bg-white"
        >
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-6">
                <div className="flex items-start gap-3">
                    {settings.logo_url ? (
                        <img
                            src={settings.logo_url}
                            alt={companyName}
                            className="h-12 w-auto object-contain"
                        />
                    ) : null}
                    <div className="flex flex-col">
            <span className="text-base font-semibold text-zinc-900">
              {companyName}
            </span>
                        {settings.company_address ? (
                            <span className="max-w-xs whitespace-pre-line text-xs text-zinc-500">
                {settings.company_address}
              </span>
                        ) : null}
                        <div className="mt-1 flex flex-col text-xs text-zinc-500">
                            {settings.company_email ? <span>{settings.company_email}</span> : null}
                            {settings.company_phone ? <span>{settings.company_phone}</span> : null}
                            {settings.company_website ? (
                                <span>{settings.company_website}</span>
                            ) : null}
                            {settings.company_tax_id ? (
                                <span>Tax ID: {settings.company_tax_id}</span>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1">
          <span className="text-lg font-bold uppercase tracking-wide text-zinc-900">
            Invoice
          </span>
                    <span className="text-sm font-medium text-zinc-700">
            {displayNumber}
          </span>
                    <Badge
                        variant={statusVariantMap[invoice.status] ?? "outline"}
                        className="capitalize"
                    >
                        {invoice.status_label ?? invoice.status}
                    </Badge>
                </div>
            </header>

            <section className="flex flex-wrap justify-between gap-6">
                <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Bill to
          </span>
                    <span className="font-medium text-zinc-900">
            {invoice.tenant?.name ?? invoice.tenant_id}
          </span>
                    {invoice.billing_address ? (
                        <span className="max-w-xs whitespace-pre-line text-xs text-zinc-500">
              {[
                  invoice.billing_address.line1,
                  invoice.billing_address.line2,
                  `${invoice.billing_address.city}, ${invoice.billing_address.postal_code}`,
                  invoice.billing_address.country,
              ]
                  .filter(Boolean)
                  .join("\n")}
            </span>
                    ) : null}
                </div>

                <div className="flex flex-col gap-1 text-xs text-zinc-500">
                    <div className="flex justify-between gap-8">
                        <span>Issued</span>
                        <span className="font-medium text-zinc-900">
              {formatDate(invoice.issued_at)}
            </span>
                    </div>
                    <div className="flex justify-between gap-8">
                        <span>Due</span>
                        <span className="font-medium text-zinc-900">
              {formatDate(invoice.due_at)}
            </span>
                    </div>
                    {invoice.paid_at ? (
                        <div className="flex justify-between gap-8">
                            <span>Paid</span>
                            <span className="font-medium text-zinc-900">
                {formatDate(invoice.paid_at)}
              </span>
                        </div>
                    ) : null}
                    {invoice.subscription?.plan_name ? (
                        <div className="flex justify-between gap-8">
                            <span>Plan</span>
                            <span className="font-medium text-zinc-900">
                {invoice.subscription.plan_name}
              </span>
                        </div>
                    ) : null}
                </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-zinc-200">
                <table className="w-full border-collapse text-sm">
                    <thead>
                    <tr className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
                        <th className="p-3 font-medium">Description</th>
                        <th className="p-3 text-center font-medium">Qty</th>
                        <th className="p-3 text-end font-medium">Unit price</th>
                        <th className="p-3 text-end font-medium">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoice.items && invoice.items.length > 0 ? (
                        invoice.items.map((item) => (
                            <tr key={item.id} className="border-t border-zinc-100">
                                <td className="p-3 text-zinc-800">{item.description}</td>
                                <td className="p-3 text-center text-zinc-600">
                                    {item.quantity}
                                </td>
                                <td className="p-3 text-end text-zinc-600">
                                    {money(item.unit_price)}
                                </td>
                                <td className="p-3 text-end font-medium text-zinc-900">
                                    {money(item.total)}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr className="border-t border-zinc-100">
                            <td className="p-3 text-zinc-500" colSpan={4}>
                                No line items recorded.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>

            <section className="flex justify-end">
                <div className="flex w-full max-w-xs flex-col gap-2">
                    <div className="flex justify-between text-zinc-600">
                        <span>Subtotal</span>
                        <span className="font-medium text-zinc-900">
              {money(invoice.subtotal)}
            </span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
            <span>
              Tax
                {invoice.tax_rate
                    ? ` (${Number(invoice.tax_rate).toFixed(2)}%)`
                    : ""}
            </span>
                        <span className="font-medium text-zinc-900">
              {money(invoice.tax)}
            </span>
                    </div>
                    <div
                        className="flex justify-between border-t border-zinc-200 pt-2 text-base font-semibold text-zinc-900">
                        <span>Total</span>
                        <span>{money(invoice.total)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                        <span>Amount paid</span>
                        <span className="font-medium text-zinc-900">
              {money(invoice.amount_paid)}
            </span>
                    </div>
                    <div
                        className={cn(
                            "flex justify-between font-semibold",
                            Number(invoice.balance_due) > 0
                                ? "text-red-600"
                                : "text-emerald-600"
                        )}
                    >
                        <span>Balance due</span>
                        <span>{money(invoice.balance_due)}</span>
                    </div>
                </div>
            </section>

            {(invoice.notes || settings.footer_note) && (
                <footer className="flex flex-col gap-2 border-t border-zinc-200 pt-4 text-xs text-zinc-500">
                    {invoice.notes ? (
                        <p className="whitespace-pre-line">{invoice.notes}</p>
                    ) : null}
                    {settings.footer_note ? (
                        <p className="whitespace-pre-line">{settings.footer_note}</p>
                    ) : null}
                </footer>
            )}
        </div>
    )
}
