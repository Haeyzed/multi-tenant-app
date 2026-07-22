import {PublicInvoiceClient} from "@/features/central/billing/invoices/components/public-invoice-client"

type PublicInvoicePageProps = {
    params: Promise<{ invoiceId: string }>
    searchParams: Promise<{ expires?: string; signature?: string }>
}

export default async function PublicInvoicePage({
                                                    params,
                                                    searchParams,
                                                }: PublicInvoicePageProps) {
    const {invoiceId} = await params
    const query = await searchParams
    const id = Number(invoiceId)

    return (
        <PublicInvoiceClient
            invoiceId={Number.isFinite(id) ? id : 0}
            expires={query.expires ?? null}
            signature={query.signature ?? null}
        />
    )
}
