"use client"

import { usePayments } from "@/features/central/billing/payments/components/payments-provider"
import { PaymentsRefundDialog } from "@/features/central/billing/payments/components/payments-refund-dialog"
import { PaymentsViewDialog } from "@/features/central/billing/payments/components/payments-view-dialog"
import { useEntityDialogClose } from "@/features/central/shared/use-entity-dialog-close"

export function PaymentsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePayments()
  const handleClose = useEntityDialogClose({ setOpen, setCurrentRow })

  if (!currentRow) {
    return null
  }

  return (
    <>
      <PaymentsViewDialog
        key={`payment-view-${currentRow.id}`}
        open={open === "view"}
        onOpenChange={(val) => {
          if (!val) {
            handleClose()
          }
        }}
        payment={currentRow}
      />

      <PaymentsRefundDialog
        key={`payment-refund-${currentRow.id}`}
        open={open === "refund"}
        onOpenChange={(val) => {
          if (!val) {
            handleClose()
          }
        }}
        payment={currentRow}
        onSuccess={handleClose}
      />
    </>
  )
}
