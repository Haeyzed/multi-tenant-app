"use client"

import React, { useState } from "react"

import useDialogState from "@/hooks/use-dialog-state"
import type { Timezone } from "@/types/central/world"

export type TimezonesDialogType = "create" | "update" | "view" | "delete"

type TimezonesContextType = {
  open: TimezonesDialogType | null
  setOpen: (str: TimezonesDialogType | null) => void
  currentRow: Timezone | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Timezone | null>>
}

const TimezonesContext = React.createContext<TimezonesContextType | null>(null)

export function TimezonesProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<TimezonesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Timezone | null>(null)

  return (
    <TimezonesContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </TimezonesContext.Provider>
  )
}

export function useTimezonesContext() {
  const context = React.useContext(TimezonesContext)

  if (!context) {
    throw new Error(
      "useTimezonesContext has to be used within <TimezonesProvider>"
    )
  }

  return context
}
