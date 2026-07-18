import { z } from "zod"

export const storeRoleSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  permissions: z.array(z.string()).optional(),
})

export const updateRoleSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  permissions: z.array(z.string()).optional(),
})

export type StoreRoleFormValues = z.infer<typeof storeRoleSchema>
export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>
