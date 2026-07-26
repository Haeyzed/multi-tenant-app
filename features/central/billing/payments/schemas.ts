import {z} from "zod"

export const refundPaymentSchema = z.object({
    amount: z.number().positive().optional(),
    reason: z.string().optional(),
})

export type RefundPaymentFormValues = z.infer<typeof refundPaymentSchema>
