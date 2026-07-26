"use client"

import React, {useState} from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type {Feature} from "@/features/central/billing/features/types"

export type FeaturesDialogType = "create" | "update" | "view" | "delete"

type FeaturesContextType = {
    open: FeaturesDialogType | null
    setOpen: (str: FeaturesDialogType | null) => void
    currentRow: Feature | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Feature | null>>
}

const FeaturesContext = React.createContext<FeaturesContextType | null>(null)

export function FeaturesProvider({children}: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<FeaturesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<Feature | null>(null)

    return (
        <FeaturesContext.Provider
            value={{open, setOpen, currentRow, setCurrentRow}}
        >
            {children}
        </FeaturesContext.Provider>
    )
}

export function useFeatures() {
    const context = React.useContext(FeaturesContext)

    if (!context) {
        throw new Error("useFeatures has to be used within <FeaturesProvider>")
    }

    return context
}
