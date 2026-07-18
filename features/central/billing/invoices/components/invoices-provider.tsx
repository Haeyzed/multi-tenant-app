"use client"

import React, { useState } from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type { Invoice } from "@/types/central/invoice"

export type InvoicesDialogType =
  | "create"
  | "view"
  | "void"
  | "charge"
  | "send-link"

type InvoicesContextType = {
  open: InvoicesDialogType | null
  setOpen: (str: InvoicesDialogType | null) => void
  currentRow: Invoice | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Invoice | null>>
}

const InvoicesContext = React.createContext<InvoicesContextType | null>(null)

export function InvoicesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<InvoicesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Invoice | null>(null)

  return (
    <InvoicesContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </InvoicesContext.Provider>
  )
}

export function useInvoices() {
  const context = React.useContext(InvoicesContext)

  if (!context) {
    throw new Error("useInvoices has to be used within <InvoicesProvider>")
  }

  return context
}
