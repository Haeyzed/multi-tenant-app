"use client"

import React, { useState } from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type { Plan } from "@/types/central/plan"

export type PlansDialogType =
    | "create"
    | "update"
    | "view"
    | "delete"
    | "activate"
    | "archive"
    | "deleteMany"
    | "activateMany"
    | "archiveMany"

export type BulkSelection = {
    ids: number[]
    onComplete?: () => void
}

type PlansContextType = {
    open: PlansDialogType | null
    setOpen: (str: PlansDialogType | null) => void
    currentRow: Plan | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Plan | null>>
    bulkSelection: BulkSelection | null
    setBulkSelection: React.Dispatch<React.SetStateAction<BulkSelection | null>>
}

const PlansContext = React.createContext<PlansContextType | null>(null)

export function PlansProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<PlansDialogType>(null)
    const [currentRow, setCurrentRow] = useState<Plan | null>(null)
    const [bulkSelection, setBulkSelection] = useState<BulkSelection | null>(null)

    return (
        <PlansContext.Provider
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
        </PlansContext.Provider>
    )
}

export function usePlans() {
    const context = React.useContext(PlansContext)

    if (!context) {
        throw new Error("usePlans has to be used within <PlansProvider>")
    }

    return context
}
