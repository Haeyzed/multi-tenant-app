"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
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
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Spinner } from "@/components/ui/spinner"
import { useLogin } from "@/features/tenant/auth/hooks/use-auth-query"
import { loginSchema } from "@/features/tenant/auth/schemas"
import { tenantRoutes } from "@/features/tenant/shell/routes"
import { handleFormApiError } from "@/lib/form-api-errors"
import { cn } from "@/lib/utils"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const loginMutation = useLogin()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        router.push(tenantRoutes.dashboard)
      },
      onError: (error) => {
        handleFormApiError(error, form.setError, "Login failed")
      },
    })
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your store</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldContent>
            <Input placeholder="m@example.com" {...form.register("email")} />
            <FieldError
              errors={
                form.formState.errors.email ? [form.formState.errors.email] : []
              }
            />
          </FieldContent>
        </Field>
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
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending && <Spinner />}
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
