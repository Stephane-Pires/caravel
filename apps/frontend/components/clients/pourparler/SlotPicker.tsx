"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { SlotSchema } from "@/utils/hook"
import { CalendarIcon } from "@heroicons/react/24/solid"
import { format } from "date-fns"
import { useCallback, useMemo, useState } from "react"

// slots are grouped by the visitor's own calendar day
const dayKey = (date: Date) => format(date, "yyyy-MM-dd")

interface SlotPickerProps {
  slots: Array<SlotSchema>
  loading: boolean
  failed: boolean
  // the chosen slot's start (ISO), or "" when none
  value: string
  onChange: (start: string) => void
}

// Pick a day that still has free slots, then one of that day's free times,
// all in the visitor's time zone. Used to book and to reschedule.
export function SlotPicker({
  slots,
  loading,
  failed,
  value,
  onChange,
}: SlotPickerProps) {
  const [day, setDay] = useState<Date | undefined>(undefined)

  const slotsByDay = useMemo(() => {
    const byDay = new Map<string, Array<SlotSchema>>()
    for (const slot of slots) {
      const key = dayKey(new Date(slot.start))
      byDay.set(key, [...(byDay.get(key) ?? []), slot])
    }
    return byDay
  }, [slots])

  const daySlots = useMemo(
    () => (day ? (slotsByDay.get(dayKey(day)) ?? []) : []),
    [day, slotsByDay],
  )

  // the calendar opens on the first bookable month and can't wander outside the bookable range
  const [firstDay, lastDay] = useMemo(() => {
    const [first] = slots
    const last = slots.findLast(Boolean)
    return [first && new Date(first.start), last && new Date(last.start)]
  }, [slots])

  const isDayFull = useCallback(
    (date: Date) => !slotsByDay.has(dayKey(date)),
    [slotsByDay],
  )

  const pickDay = useCallback(
    (picked: Date | undefined) => {
      setDay(picked)
      onChange("") // a new day: pick its time again
    },
    [onChange],
  )

  return (
    <div className="flex flex-row gap-3">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="input"
            disabled={loading || failed}
            className={cn(
              "basis-3/5 pl-3 text-left font-normal",
              !day && "text-muted-foreground",
            )}
          >
            {loading
              ? "Loading available slots…"
              : day
                ? format(day, "EEE d MMM")
                : "Pick a day"}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={day}
            onSelect={pickDay}
            disabled={isDayFull}
            defaultMonth={day ?? firstDay}
            startMonth={firstDay}
            endMonth={lastDay}
          />
        </PopoverContent>
      </Popover>

      <Select
        onValueChange={onChange}
        value={value || undefined}
        disabled={!day || !daySlots.length}
      >
        <SelectTrigger
          className="basis-2/5"
          aria-label="Time"
        >
          <SelectValue placeholder="Time" />
        </SelectTrigger>
        <SelectContent>
          {daySlots.map((slot) => (
            <SelectItem
              key={slot.start}
              value={slot.start}
            >
              {format(new Date(slot.start), "HH:mm")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
