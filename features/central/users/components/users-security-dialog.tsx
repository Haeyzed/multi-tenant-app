"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetUserSecurity } from "@/features/central/users/hooks/use-user-query"
import { useQueryErrorToast } from "@/hooks/use-query-error-toast"
import type { CentralUser } from "@/types/central/user"

type UsersSecurityDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: CentralUser
}

export function UsersSecurityDialog({
  open,
  onOpenChange,
  user,
}: UsersSecurityDialogProps) {
  const { data, isLoading, error } = useGetUserSecurity(user.id, open)

  useQueryErrorToast(error ?? null, "Failed to load security summary.")

  const rows = data
    ? [
        [
          "Two-factor authentication",
          data.two_factor_enabled ? "Enabled" : "Disabled",
        ],
        [
          "Email verified",
          data.email_verified ? "Verified" : "Not verified",
        ],
        [
          "Last login",
          data.last_login_at
            ? new Date(data.last_login_at).toLocaleString()
            : "—",
        ],
        ["Last login IP", data.last_login_ip || "—"],
        ["Active tokens", String(data.token_count)],
      ]
    : []

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Security summary</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Security-related details for {user.name}.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="space-y-3 text-sm">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {data?.two_factor_enabled ? (
                  <Badge variant="secondary">2FA enabled</Badge>
                ) : (
                  <Badge variant="outline">2FA disabled</Badge>
                )}
                {data?.email_verified ? (
                  <Badge variant="secondary">Email verified</Badge>
                ) : (
                  <Badge variant="outline">Email unverified</Badge>
                )}
              </div>
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-start justify-between gap-4 border-b pb-2 last:border-b-0"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="text-end font-medium">{value}</span>
                </div>
              ))}
            </>
          )}
        </div>

        <ResponsiveDialogFooter>
          <ResponsiveDialogClose
            render={<Button variant="outline">Close</Button>}
          />
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
