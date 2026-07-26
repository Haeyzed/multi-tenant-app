import * as React from "react"

const DEFAULT_CLEAR_DELAY_MS = 300

type UseEntityDialogCloseOptions = {
  setOpen: (value: null) => void
  setCurrentRow?: (value: null) => void
  onAfterClose?: () => void
  clearDelayMs?: number
}

/**
 * Shared close handler for entity CRUD / bulk providers:
 * closes the dialog immediately, then clears row/selection after the exit animation.
 */
export function useEntityDialogClose({
  setOpen,
  setCurrentRow,
  onAfterClose,
  clearDelayMs = DEFAULT_CLEAR_DELAY_MS,
}: UseEntityDialogCloseOptions) {
  return React.useCallback(() => {
    setOpen(null)
    window.setTimeout(() => {
      setCurrentRow?.(null)
      onAfterClose?.()
    }, clearDelayMs)
  }, [setOpen, setCurrentRow, onAfterClose, clearDelayMs])
}
