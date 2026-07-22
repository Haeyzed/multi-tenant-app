import {z} from "zod"

export const storeInvoiceItemSchema = z.object({
    description: z.string().min(1, {message: "Description is required."}),
    quantity: z.coerce.number().int().min(1).default(1),
    unit_price: z.coerce.number().min(0, {
        message: "Unit price must be at least 0.",
    }),
})

export const storeInvoiceSchema = z.object({
    tenant_id: z.string().min(1, {message: "Tenant is required."}),
    subscription_id: z.coerce.number().int().positive().nullable().optional(),
    tax_rate: z.coerce.number().min(0).max(100).optional(),
    currency: z.string().optional(),
    notes: z.string().optional(),
    items: z
        .array(storeInvoiceItemSchema)
        .min(1, {message: "Add at least one line item."}),
})

export const chargeInvoiceSchema = z.object({
    gateway: z.string().optional(),
    amount: z.coerce.number().positive().optional(),
})

export type StoreInvoiceItemFormValues = z.infer<typeof storeInvoiceItemSchema>
export type StoreInvoiceFormValues = z.infer<typeof storeInvoiceSchema>
export type ChargeInvoiceFormValues = z.infer<typeof chargeInvoiceSchema>
