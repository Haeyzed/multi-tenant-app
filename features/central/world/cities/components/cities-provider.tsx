"use client"

import React, {useState} from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type {City} from "@/features/central/world/types"

export type CitiesDialogType = "create" | "update" | "view" | "delete"

type CitiesContextType = {
    open: CitiesDialogType | null
    setOpen: (str: CitiesDialogType | null) => void
    currentRow: City | null
    setCurrentRow: React.Dispatch<React.SetStateAction<City | null>>
}

const CitiesContext = React.createContext<CitiesContextType | null>(null)

export function CitiesProvider({children}: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<CitiesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<City | null>(null)

    return (
        <CitiesContext.Provider value={{open, setOpen, currentRow, setCurrentRow}}>
            {children}
        </CitiesContext.Provider>
    )
}

export function useCities() {
    const context = React.useContext(CitiesContext)

    if (!context) {
        throw new Error("useCities has to be used within <CitiesProvider>")
    }

    return context
}
