"use client"

import React, { useState } from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type { FailedJob } from "@/types/central/monitoring"

export type MonitoringDialogType = "viewException" | "retry" | "flush"

type MonitoringContextType = {
  open: MonitoringDialogType | null
  setOpen: (str: MonitoringDialogType | null) => void
  currentRow: FailedJob | null
  setCurrentRow: React.Dispatch<React.SetStateAction<FailedJob | null>>
}

const MonitoringContext = React.createContext<MonitoringContextType | null>(
  null
)

export function MonitoringProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<MonitoringDialogType>(null)
  const [currentRow, setCurrentRow] = useState<FailedJob | null>(null)

  return (
    <MonitoringContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </MonitoringContext.Provider>
  )
}

export function useMonitoring() {
  const context = React.useContext(MonitoringContext)

  if (!context) {
    throw new Error("useMonitoring has to be used within <MonitoringProvider>")
  }

  return context
}
