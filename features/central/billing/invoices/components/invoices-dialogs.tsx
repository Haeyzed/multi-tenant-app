"use client"

import { useInvoices } from "@/features/central/billing/invoices/components/invoices-provider"
import { InvoicesChargeDialog } from "@/features/central/billing/invoices/components/invoices-charge-dialog"
import { InvoicesFormDialog } from "@/features/central/billing/invoices/components/invoices-form-dialog"
import { InvoicesViewDialog } from "@/features/central/billing/invoices/components/invoices-view-dialog"
import {
  useSendInvoicePaymentLink,
  useVoidInvoice,
} from "@/features/central/billing/invoices/hooks/use-invoice-query"
import { ConfirmActionDialog } from "@/features/central/shared/components/confirm-action-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"
import { toastApiError, toastApiSuccess } from "@/lib/toast-api"

export function InvoicesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useInvoices()
  const voidInvoice = useVoidInvoice()
  const sendPaymentLink = useSendInvoicePaymentLink()

  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })

  const runSendLink = () => {
    if (!currentRow) {
      return
    }

    sendPaymentLink.mutate(
      { id: currentRow.id },
      {
        onSuccess: (result) => {
          toastApiSuccess(
            result.message,
            `Payment link sent to ${result.data.email}`
          )
          handleClose()
        },
        onError: (error) => {
          toastApiError(error, "Failed to send payment link")
        },
      }
    )
  }

  const runVoid = () => {
    if (!currentRow) {
      return
    }

    voidInvoice.mutate(currentRow.id, {
      onSuccess: (result) => {
        toastApiSuccess(
          result.message,
          `Invoice ${currentRow.number} voided successfully`
        )
        handleClose()
      },
      onError: (error) => {
        toastApiError(error, "Failed to void invoice")
      },
    })
  }

  return (
    <>
      <InvoicesFormDialog
        open={open === "create"}
        onOpenChange={(val) => {
          if (!val) {
            setOpen(null)
          }
        }}
      />

      {currentRow ? (
        <>
          <InvoicesViewDialog
            key={`invoice-view-${currentRow.id}`}
            open={open === "view"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            invoice={currentRow}
          />

          <ConfirmActionDialog
            open={open === "send-link"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Send payment link"
            description={
              <>
                Email a signed payment link for invoice{" "}
                <strong>{currentRow.number}</strong> to the tenant owner.
              </>
            }
            confirmLabel="Send link"
            isPending={sendPaymentLink.isPending}
            onConfirm={runSendLink}
          />

          <ConfirmActionDialog
            open={open === "void"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            title="Void invoice"
            description={
              <>
                Void invoice <strong>{currentRow.number}</strong>? This cannot be
                undone.
              </>
            }
            confirmLabel="Void"
            variant="destructive"
            isPending={voidInvoice.isPending}
            onConfirm={runVoid}
          />

          <InvoicesChargeDialog
            key={`invoice-charge-${currentRow.id}`}
            open={open === "charge"}
            onOpenChange={(val) => {
              if (!val) {
                handleClose()
              }
            }}
            invoice={currentRow}
            onSuccess={handleClose}
          />
        </>
      ) : null}
    </>
  )
}
