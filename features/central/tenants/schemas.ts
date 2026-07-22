import {z} from "zod"

export const storeTenantSchema = z.object({
    name: z.string().min(1, {message: "Name is required."}),
    slug: z.string().optional(),
    email: z.union([z.email(), z.literal("")]).optional(),
    phone: z.string().optional(),
    status: z
        .enum([
            "pending",
            "active",
            "suspended",
            "trial",
            "expired",
            "grace_period",
            "archived",
        ])
        .optional(),
    subdomain: z.string().optional(),
    trial_ends_at: z.string().nullable().optional(),
})

export const updateTenantSchema = z.object({
    name: z.string().min(1, {message: "Name is required."}),
    slug: z.string().optional(),
    email: z.union([z.email(), z.literal("")]).optional(),
    phone: z.string().optional(),
    trial_ends_at: z.string().nullable().optional(),
})

export type StoreTenantFormValues = z.infer<typeof storeTenantSchema>
export type UpdateTenantFormValues = z.infer<typeof updateTenantSchema>
