import {z} from "zod"

export const storePermissionSchema = z.object({
    name: z
        .string()
        .min(1, {message: "Name is required."})
        .regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/, {
            message: "Use lowercase dot-namespaced format (e.g. reports.export).",
        }),
})

export const updatePermissionSchema = storePermissionSchema

export type StorePermissionFormValues = z.infer<typeof storePermissionSchema>
export type UpdatePermissionFormValues = z.infer<typeof updatePermissionSchema>
