"use client"

import React, { useState } from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type { PermissionItem } from "@/types/central/rbac"

export type PermissionsDialogType =
  | "create"
  | "update"
  | "view"
  | "delete"
  | "deleteMany"

export type BulkSelection = {
  ids: number[]
  onComplete?: () => void
}

type PermissionsContextType = {
  open: PermissionsDialogType | null
  setOpen: (str: PermissionsDialogType | null) => void
  currentRow: PermissionItem | null
  setCurrentRow: React.Dispatch<React.SetStateAction<PermissionItem | null>>
  bulkSelection: BulkSelection | null
  setBulkSelection: React.Dispatch<React.SetStateAction<BulkSelection | null>>
}

const PermissionsContext = React.createContext<PermissionsContextType | null>(
  null
)

export function PermissionsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<PermissionsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<PermissionItem | null>(null)
  const [bulkSelection, setBulkSelection] = useState<BulkSelection | null>(null)

  return (
    <PermissionsContext.Provider
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
    </PermissionsContext.Provider>
  )
}

export function usePermissions() {
  const context = React.useContext(PermissionsContext)

  if (!context) {
    throw new Error("usePermissions has to be used within <PermissionsProvider>")
  }

  return context
}
