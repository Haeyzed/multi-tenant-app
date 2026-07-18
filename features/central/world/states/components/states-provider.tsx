"use client"

import React, { useState } from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type { State } from "@/types/central/world"

export type StatesDialogType = "create" | "update" | "view" | "delete"

type StatesContextType = {
  open: StatesDialogType | null
  setOpen: (str: StatesDialogType | null) => void
  currentRow: State | null
  setCurrentRow: React.Dispatch<React.SetStateAction<State | null>>
}

const StatesContext = React.createContext<StatesContextType | null>(null)

export function StatesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<StatesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<State | null>(null)

  return (
    <StatesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </StatesContext.Provider>
  )
}

export function useStatesContext() {
  const context = React.useContext(StatesContext)

  if (!context) {
    throw new Error("useStatesContext has to be used within <StatesProvider>")
  }

  return context
}
