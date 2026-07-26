import {z} from "zod"

export const storeSubscriptionSchema = z.object({
    tenant_id: z.string().min(1, {message: "Tenant is required."}),
    plan_id: z.number().int().positive({message: "Plan is required."}),
    country: z
        .string()
        .length(2, {message: "Please select a country."})
        .toUpperCase()
        .optional()
        .or(z.literal("")),
    plan_price_id: z.number().int().positive().nullable().optional(),
    currency: z
        .string()
        .length(3)
        .toUpperCase()
        .optional()
        .or(z.literal("")),
    billing_interval: z
        .enum(["monthly", "quarterly", "yearly"])
        .optional()
        .nullable(),
    gateway: z.string().optional(),
    trial_days: z.number().int().min(0).nullable().optional(),
})

export const cancelSubscriptionSchema = z.object({
    immediately: z.boolean(),
    reason: z.string().optional(),
})

export const changeSubscriptionPlanSchema = z.object({
    plan_id: z.number().int().positive({message: "Plan is required."}),
    country: z
        .string()
        .length(2, {message: "Please select a country."})
        .toUpperCase()
        .optional()
        .or(z.literal("")),
    plan_price_id: z.number().int().positive().nullable().optional(),
    currency: z
        .string()
        .length(3)
        .toUpperCase()
        .optional()
        .or(z.literal("")),
    billing_interval: z
        .enum(["monthly", "quarterly", "yearly"])
        .optional()
        .nullable(),
})

export const markPastDueSchema = z.object({
    grace_days: z.number().int().min(1).max(30).optional(),
})

export type StoreSubscriptionFormValues = z.infer<
    typeof storeSubscriptionSchema
>
export type CancelSubscriptionFormValues = z.infer<
    typeof cancelSubscriptionSchema
>
export type ChangeSubscriptionPlanFormValues = z.infer<
    typeof changeSubscriptionPlanSchema
>
export type MarkPastDueFormValues = z.infer<typeof markPastDueSchema>
