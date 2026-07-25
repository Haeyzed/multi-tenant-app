import {z} from "zod"

export const planFeatureAssignmentSchema = z.object({
    feature_id: z.coerce.number().int().positive(),
    limit_type: z
        .enum(["unlimited", "count", "storage", "bandwidth", "periodic", "boolean"])
        .optional(),
    limit_value: z.coerce.number().int().min(0).nullable().optional(),
    is_unlimited: z.boolean().optional(),
    is_enabled: z.boolean().optional(),
    tracks_usage: z.boolean().optional(),
    reset_period: z
        .enum(["monthly", "quarterly", "yearly"])
        .nullable()
        .optional(),
})

export const storePlanSchema = z.object({
    name: z.string().min(1, {message: "Name is required."}),
    slug: z.string().optional(),
    description: z.string().optional(),
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
    features: z.array(planFeatureAssignmentSchema).optional(),
})

export const updatePlanSchema = storePlanSchema

export type PlanFeatureAssignmentFormValues = z.infer<
    typeof planFeatureAssignmentSchema
>
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
