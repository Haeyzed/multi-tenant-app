import {z} from "zod"

export const storeFeatureSchema = z.object({
    feature_category_id: z.number().nullable().optional(),
    name: z.string().min(1, {message: "Name is required."}),
    slug: z.string().optional(),
    key: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    status: z.enum(["active", "inactive", "deprecated"]),
    default_limit_type: z.enum([
        "unlimited",
        "count",
        "storage",
        "bandwidth",
        "periodic",
        "boolean",
    ]),
    default_limit_value: z.number().int().min(0).nullable().optional(),
    unit: z.string().optional(),
    is_available: z.boolean(),
    tracks_usage: z.boolean(),
    sort_order: z.number().int().min(0),
})

export const updateFeatureSchema = storeFeatureSchema

export type StoreFeatureFormValues = z.infer<typeof storeFeatureSchema>
export type UpdateFeatureFormValues = z.infer<typeof updateFeatureSchema>
