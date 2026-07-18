import { z } from "zod"

export const storeFeatureCategorySchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  slug: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  sort_order: z.coerce.number().int().min(0),
  is_active: z.boolean(),
})

export const updateFeatureCategorySchema = storeFeatureCategorySchema

export type StoreFeatureCategoryFormValues = z.infer<
  typeof storeFeatureCategorySchema
>
export type UpdateFeatureCategoryFormValues = z.infer<
  typeof updateFeatureCategorySchema
>
