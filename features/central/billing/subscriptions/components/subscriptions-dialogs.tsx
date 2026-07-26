"use client"

import * as React from "react"

import { useSubscriptions } from "@/features/central/billing/subscriptions/components/subscriptions-provider"
import { SubscriptionsCancelDialog } from "@/features/central/billing/subscriptions/components/subscriptions-cancel-dialog"
import { SubscriptionsChangePlanDialog } from "@/features/central/billing/subscriptions/components/subscriptions-change-plan-dialog"
import { SubscriptionsFormDialog } from "@/features/central/billing/subscriptions/components/subscriptions-form-dialog"
import { SubscriptionsPastDueDialog } from "@/features/central/billing/subscriptions/components/subscriptions-past-due-dialog"
import { SubscriptionsViewDialog } from "@/features/central/billing/subscriptions/components/subscriptions-view-dialog"
import {
  useExpireSubscription,
  usePauseSubscription,
  useRenewSubscription,
  useResumeSubscription,
} from "@/features/central/billing/subscriptions/hooks/use-subscription-query"
import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function SubscriptionsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useSubscriptions()
  const renewSubscription = useRenewSubscription()
  const pauseSubscription = usePauseSubscription()
  const resumeSubscription = useResumeSubscription()
  const expireSubscription = useExpireSubscription()

  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })

  const runAction = (
    action: "renew" | "pause" | "resume" | "expire",
    mutate: (
      id: number,
      options: {
        onSuccess: (result: { message?: string }) => void
        onError: (error: unknown) => void
      }
    ) => void
  ) => {
    if (!currentRow) {
      return
    }

    const pastLabel =
      action === "renew"
        ? "renewed"
        : action === "pause"
          ? "paused"
          : action === "resume"
            ? "resumed"
            : "expired"

    mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Subscription ${pastLabel} successfully`
        )
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, `Failed to ${action} subscription`)
      },
    })
  }

  return (
    <>
      <SubscriptionsFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <SubscriptionsViewDialog
            key={`subscription-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            subscription={currentRow}
          />

          <ConfirmActionDialog
            open={open === "renew"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Renew subscription"
            description={`Advance the billing period for subscription #${currentRow.id}?`}
            confirmLabel="Renew"
            isPending={renewSubscription.isPending}
            onConfirm={() =>
              runAction("renew", (id, options) =>
                renewSubscription.mutate(id, options)
              )
            }
          />

          <ConfirmActionDialog
            open={open === "pause"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Pause subscription"
            description={`Temporarily suspend billing and access for subscription #${currentRow.id}?`}
            confirmLabel="Pause"
            isPending={pauseSubscription.isPending}
            onConfirm={() =>
              runAction("pause", (id, options) =>
                pauseSubscription.mutate(id, options)
              )
            }
          />

          <ConfirmActionDialog
            open={open === "resume"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Resume subscription"
            description={`Resume billing and access for subscription #${currentRow.id}?`}
            confirmLabel="Resume"
            isPending={resumeSubscription.isPending}
            onConfirm={() =>
              runAction("resume", (id, options) =>
                resumeSubscription.mutate(id, options)
              )
            }
          />

          <ConfirmActionDialog
            open={open === "expire"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Expire subscription"
            description={`Mark subscription #${currentRow.id} as expired? This revokes access immediately.`}
            confirmLabel="Expire"
            variant="destructive"
            isPending={expireSubscription.isPending}
            onConfirm={() =>
              runAction("expire", (id, options) =>
                expireSubscription.mutate(id, options)
              )
            }
          />

          <SubscriptionsCancelDialog
            key={`subscription-cancel-${currentRow.id}`}
            open={open === "cancel"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            subscription={currentRow}
            onSuccess={handleClose}
          />

          <SubscriptionsPastDueDialog
            key={`subscription-past-due-${currentRow.id}`}
            open={open === "past-due"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            subscription={currentRow}
            onSuccess={handleClose}
          />

          <SubscriptionsChangePlanDialog
            key={`subscription-change-plan-${currentRow.id}-${open}`}
            open={open === "upgrade" || open === "downgrade"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            subscription={currentRow}
            mode={open === "downgrade" ? "downgrade" : "upgrade"}
            onSuccess={handleClose}
          />
        </>
      ) : null}
    </>
  )
}
