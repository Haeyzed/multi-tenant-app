"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type DatePickerProps = {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  className?: string
}

export function DatePicker({
  selected,
  onSelect,
  placeholder = "Pick a date",
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            data-empty={!selected}
            className={cn(
              "w-full justify-start text-start font-normal data-[empty=true]:text-muted-foreground",
              className
            )}
          >
            {selected ? (
              format(selected, "MMM d, yyyy")
            ) : (
              <span>{placeholder}</span>
            )}
            <CalendarIcon className="ms-auto size-4 opacity-50" />
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={selected}
          onSelect={onSelect}
          disabled={(date: Date) => {
            if (minDate && date < minDate) {
              return true
            }
            if (maxDate && date > maxDate) {
              return true
            }
            return false
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
