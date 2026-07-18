"use client"

import React, { useState } from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type { CentralRole } from "@/types/central/rbac"

export type RolesDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "assignPermissions"
  | "deleteMany"

export type BulkSelection = {
  ids: number[]
  onComplete?: () => void
}

type RolesContextType = {
  open: RolesDialogType | null
  setOpen: (str: RolesDialogType | null) => void
  currentRow: CentralRole | null
  setCurrentRow: React.Dispatch<React.SetStateAction<CentralRole | null>>
  bulkSelection: BulkSelection | null
  setBulkSelection: React.Dispatch<React.SetStateAction<BulkSelection | null>>
}

const RolesContext = React.createContext<RolesContextType | null>(null)

export function RolesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<RolesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<CentralRole | null>(null)
  const [bulkSelection, setBulkSelection] = useState<BulkSelection | null>(null)

  return (
    <RolesContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        bulkSelection,
        setBulkSelection,
      }}
    >
      {children}
    </RolesContext.Provider>
  )
}

export function useRoles() {
  const context = React.useContext(RolesContext)

  if (!context) {
    throw new Error("useRoles has to be used within <RolesProvider>")
  }

  return context
}
