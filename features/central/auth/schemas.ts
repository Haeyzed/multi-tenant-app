import { z } from "zod"

export const loginSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

export const twoFactorSchema = z
  .object({
    two_factor_code: z.string().optional(),
    recovery_code: z.string().optional(),
  })
  .refine(
    (data) =>
      (data.two_factor_code && data.two_factor_code.length === 6) ||
      (data.recovery_code && data.recovery_code.trim().length > 0),
    {
      message: "Enter a 6-digit code or a recovery code.",
      path: ["two_factor_code"],
    }
  )

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
})

export const resetPasswordSchema = z
  .object({
    email: z.email({ message: "Please enter a valid email address." }),
    token: z.string().min(1, { message: "Reset token is required." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  })

export const signupSchema = z
  .object({
    country: z
      .string()
      .length(2, { message: "Please select a country." })
      .toUpperCase(),
    plan_id: z.number({ message: "Please select a plan." }),
    name: z.string().min(1, { message: "Organization name is required." }),
    slug: z.string().optional(),
    domain: z.string().optional(),
    owner_name: z.string().optional(),
    email: z.email({ message: "Please enter a valid email address." }),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    password_confirmation: z.string(),
    gateway: z.string().min(1, { message: "Please select a payment provider." }),
    billing_line1: z.string().optional(),
    billing_city: z.string().optional(),
    billing_postal_code: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  })

export type SignupFormValues = z.infer<typeof signupSchema>
