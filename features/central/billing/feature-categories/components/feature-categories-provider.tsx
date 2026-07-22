"use client"

import React, {useState} from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type {FeatureCategory} from "@/types/central/feature-category"

export type FeatureCategoriesDialogType = "create" | "update" | "view" | "delete"

type FeatureCategoriesContextType = {
    open: FeatureCategoriesDialogType | null
    setOpen: (str: FeatureCategoriesDialogType | null) => void
    currentRow: FeatureCategory | null
    setCurrentRow: React.Dispatch<React.SetStateAction<FeatureCategory | null>>
}

const FeatureCategoriesContext =
    React.createContext<FeatureCategoriesContextType | null>(null)

export function FeatureCategoriesProvider({
                                              children,
                                          }: {
    children: React.ReactNode
}) {
    const [open, setOpen] = useDialogState<FeatureCategoriesDialogType>(null)
    const [currentRow, setCurrentRow] = useState<FeatureCategory | null>(null)

    return (
        <FeatureCategoriesContext.Provider
            value={{open, setOpen, currentRow, setCurrentRow}}
        >
            {children}
        </FeatureCategoriesContext.Provider>
    )
}

export function useFeatureCategories() {
    const context = React.useContext(FeatureCategoriesContext)

    if (!context) {
        throw new Error(
            "useFeatureCategories has to be used within <FeatureCategoriesProvider>"
        )
    }

    return context
}
