"use client"

import React, {useState} from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type {Tenant} from "@/types/central/tenant"

export type TenantsDialogType =
    | "create"
    | "update"
    | "view"
    | "delete"
    | "activate"
    | "suspend"
    | "deleteMany"
    | "suspendMany"
    | "activateMany"

export type BulkSelection = {
    ids: string[]
    onComplete?: () => void
}

type TenantsContextType = {
    open: TenantsDialogType | null
    setOpen: (str: TenantsDialogType | null) => void
    currentRow: Tenant | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Tenant | null>>
    bulkSelection: BulkSelection | null
    setBulkSelection: React.Dispatch<React.SetStateAction<BulkSelection | null>>
}

const TenantsContext = React.createContext<TenantsContextType | null>(null)

export function TenantsProvider({children}: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<TenantsDialogType>(null)
    const [currentRow, setCurrentRow] = useState<Tenant | null>(null)
    const [bulkSelection, setBulkSelection] = useState<BulkSelection | null>(null)

    return (
        <TenantsContext.Provider
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
        </TenantsContext.Provider>
    )
}

export function useTenants() {
    const context = React.useContext(TenantsContext)

    if (!context) {
        throw new Error("useTenants has to be used within <TenantsProvider>")
    }

    return context
}
