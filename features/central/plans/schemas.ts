import {z} from "zod"

export const storePlanSchema = z.object({
    name: z.string().min(1, {message: "Name is required."}),
    slug: z.string().optional(),
    description: z.string().optional(),
    price: z.coerce.number().min(0),
    currency: z.string().length(3, {message: "Use a 3-letter currency code."}),
    billing_interval: z.enum([
        "free",
        "trial",
        "monthly",
        "quarterly",
        "yearly",
        "lifetime",
        "enterprise",
    ]),
    trial_days: z.coerce.number().int().min(0).max(365),
    status: z.enum(["draft", "active", "inactive", "archived"]),
    visibility: z.enum(["public", "private", "hidden"]),
    is_featured: z.boolean(),
    sort_order: z.coerce.number().int().min(0),
})

export const updatePlanSchema = storePlanSchema

export type StorePlanFormValues = z.infer<typeof storePlanSchema>
export type UpdatePlanFormValues = z.infer<typeof updatePlanSchema>

export const planPriceSchema = z.object({
    amount: z.coerce.number().min(0),
    currency: z.string().length(3, {message: "Use a 3-letter currency code."}),
    billing_interval: z.enum(["monthly", "quarterly", "yearly"]),
    trial_days: z.coerce.number().int().min(0).max(365).nullable().optional(),
    status: z.enum(["draft", "active", "inactive", "archived"]),
})

export type PlanPriceFormValues = z.infer<typeof planPriceSchema>
