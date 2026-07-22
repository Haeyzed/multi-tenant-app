"use client"

import React, {useState} from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type {Language} from "@/types/central/world"

export type LanguagesDialogType = "create" | "update" | "view" | "delete"

type LanguagesContextType = {
    open: LanguagesDialogType | null
    setOpen: (str: LanguagesDialogType | null) => void
    currentRow: Language | null
    setCurrentRow: React.Dispatch<React.SetStateAction<Language | null>>
}

const LanguagesContext = React.createContext<LanguagesContextType | null>(null)

export function LanguagesProvider({
                                      children,
                                  }: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<LanguagesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<Language | null>(null)

    return (
        <LanguagesContext.Provider
            value={{open, setOpen, currentRow, setCurrentRow}}
        >
            {children}
        </LanguagesContext.Provider>
    )
}

export function useLanguagesContext() {
    const context = React.useContext(LanguagesContext)

    if (!context) {
        throw new Error(
            "useLanguagesContext has to be used within <LanguagesProvider>"
        )
    }

    return context
}
