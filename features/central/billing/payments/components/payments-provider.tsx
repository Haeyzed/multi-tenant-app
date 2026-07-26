"use client"

import React, {useState} from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type {Payment} from "@/features/central/billing/payments/types"

export type PaymentsDialogType = "view" | "refund"

type PaymentsContextType = {
    open: PaymentsDialogType | null
    setOpen: (str: PaymentsDialogType | null) => void
    currentRow: Payment | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Payment | null>>
}

const PaymentsContext = React.createContext<PaymentsContextType | null>(null)

export function PaymentsProvider({children}: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<PaymentsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<Payment | null>(null)

    return (
        <PaymentsContext.Provider
            value={{open, setOpen, currentRow, setCurrentRow}}
        >
            {children}
        </PaymentsContext.Provider>
    )
}

export function usePayments() {
    const context = React.useContext(PaymentsContext)

    if (!context) {
        throw new Error("usePayments has to be used within <PaymentsProvider>")
    }

    return context
}
