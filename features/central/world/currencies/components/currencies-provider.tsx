"use client"

import React, {useState} from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type {Currency} from "@/types/central/world"

export type CurrenciesDialogType = "create" | "update" | "view" | "delete"

type CurrenciesContextType = {
    open: CurrenciesDialogType | null
    setOpen: (str: CurrenciesDialogType | null) => void
    currentRow: Currency | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Currency | null>>
}

const CurrenciesContext = React.createContext<CurrenciesContextType | null>(
    null
)

export function CurrenciesProvider({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<CurrenciesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<Currency | null>(null)

    return (
        <CurrenciesContext.Provider
            value={{open, setOpen, currentRow, setCurrentRow}}
        >
            {children}
        </CurrenciesContext.Provider>
    )
}

export function useCurrenciesContext() {
    const context = React.useContext(CurrenciesContext)

    if (!context) {
        throw new Error(
            "useCurrenciesContext has to be used within <CurrenciesProvider>"
        )
    }

    return context
}
