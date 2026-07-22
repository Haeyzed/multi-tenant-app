import {z} from "zod"

export const userStatusSchema = z.enum(["active", "inactive", "suspended"])

export const storeUserSchema = z
    .object({
        name: z.string().min(1, {message: "Name is required."}),
        email: z.email({message: "Enter a valid email."}),
        phone: z.string().optional(),
        timezone: z.string().optional(),
        status: userStatusSchema.optional(),
        roles: z.array(z.string()).optional(),
        password: z.string().optional(),
        password_confirmation: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (!data.password) {
            return
        }

        if (data.password.length < 8) {
            ctx.addIssue({
                code: "custom",
                path: ["password"],
                message: "Password must be at least 8 characters.",
            })
        }

        if (data.password !== data.password_confirmation) {
            ctx.addIssue({
                code: "custom",
                path: ["password_confirmation"],
                message: "Passwords do not match.",
            })
        }
    })

export const updateUserSchema = z.object({
    name: z.string().min(1, {message: "Name is required."}),
    email: z.email({message: "Enter a valid email."}),
    phone: z.string().optional(),
    timezone: z.string().optional(),
    roles: z.array(z.string()).optional(),
})

export type StoreUserFormValues = z.infer<typeof storeUserSchema>
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
