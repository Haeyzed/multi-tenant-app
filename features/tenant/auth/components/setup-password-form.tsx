"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { PasswordInput } from "@/components/ui/password-input"
import { Spinner } from "@/components/ui/spinner"
import { useSetupPassword } from "@/features/tenant/auth/hooks/use-auth-query"
import { setupPasswordSchema } from "@/features/tenant/auth/schemas"
import { tenantRoutes } from "@/features/tenant/shell/routes"
import { handleFormApiError } from "@/lib/form-api-errors"
import { cn } from "@/lib/utils"

export function SetupPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const setupMutation = useSetupPassword()

  const form = useForm<z.infer<typeof setupPasswordSchema>>({
    resolver: zodResolver(setupPasswordSchema),
    defaultValues: {
      token,
      password: "",
      password_confirmation: "",
    },
  })

  const onSubmit = (values: z.infer<typeof setupPasswordSchema>) => {
    setupMutation.mutate(values, {
      onSuccess: () => {
        router.push(tenantRoutes.dashboard)
      },
      onError: (error) => {
        handleFormApiError(error, form.setError, "Could not set password")
      },
    })
  }

  if (!token) {
    return (
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">Invalid setup link</h1>
        <p className="text-sm text-muted-foreground">
          This password setup link is missing a token. Request a new invite from
          your platform administrator.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Set your password</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Choose a password to activate your store owner account.
          </p>
        </div>
        <input type="hidden" {...form.register("token")} />
        <Field>
          <FieldLabel>Password</FieldLabel>
          <FieldContent>
            <PasswordInput {...form.register("password")} />
            <FieldError
              errors={
                form.formState.errors.password
                  ? [form.formState.errors.password]
                  : []
              }
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel>Confirm password</FieldLabel>
          <FieldContent>
            <PasswordInput {...form.register("password_confirmation")} />
            <FieldError
              errors={
                form.formState.errors.password_confirmation
                  ? [form.formState.errors.password_confirmation]
                  : []
              }
            />
          </FieldContent>
        </Field>
        <Field>
          <Button
            type="submit"
            className="w-full"
            disabled={setupMutation.isPending}
          >
            {setupMutation.isPending && <Spinner />}
            {setupMutation.isPending ? "Saving..." : "Set password"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
