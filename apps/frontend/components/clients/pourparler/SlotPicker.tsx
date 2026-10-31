"use client"

import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import type { SlotSchema } from "@/utils/hook"
import { format } from "date-fns"
import { type ChangeEvent, useCallback, useId, useMemo, useState } from "react"

// slots are grouped by the visitor's own calendar day
const dayKey = (date: Date) => format(date, "yyyy-MM-dd")

// a day splits in three, so a day's ~24 free times never show at once
const PERIODS = [
  { id: "morning", label: "Morning", until: 12 },
  { id: "afternoon", label: "Afternoon", until: 17 },
  { id: "evening", label: "Evening", until: 24 },
] as const
type PeriodId = (typeof PERIODS)[number]["id"]
const [, , LAST_PERIOD] = PERIODS
const periodOf = (start: string): PeriodId =>
  (
    PERIODS.find((period) => new Date(start).getHours() < period.until) ??
    LAST_PERIOD
  ).id

// a period or a time: a native radio under a label, so arrow keys and screen readers work as
// they do on any radio group, with a 44px tap target and the choice shown filled.
// `relative` keeps the hidden radio inside its chip instead of positioned against the page
const CHIP =
  "relative flex h-11 cursor-pointer items-center justify-center rounded-lg border-2 border-content-900/25 bg-white text-content-900 transition-colors hover:border-content-900 has-checked:border-content-900 has-checked:bg-content-900 has-checked:text-white has-focus-visible:ring-[3px] has-focus-visible:ring-content-700/60"

// the month on white: full days struck through, today in bold, the chosen day filled in the
// same dark blue as the chosen period and time; 36px cells on phones so the week fits
const CALENDAR_CLASSES = {
  root: "w-full",
  disabled: "text-content-900/40 line-through",
  today: "font-extrabold",
}

// oxlint-disable-next-line no-magic-numbers
const PLACEHOLDERS = Array.from({ length: 8 }, (_, index) => index)

interface SlotPickerProps {
  slots: Array<SlotSchema>
  loading: boolean
  failed: boolean
  // the chosen slot's start (ISO), or "" when none
  value: string
  onChange: (start: string) => void
}

// A month calendar where only days with a free slot can be picked, then that day's free
// times split into Morning, Afternoon and Evening, all in the visitor's time zone. The first
// free day starts selected, so times show without a click. Used to book and to reschedule.
export function SlotPicker({
  slots,
  loading,
  failed,
  value,
  onChange,
}: SlotPickerProps) {
  const name = useId()
  const [pickedDay, setPickedDay] = useState<Date>()
  const [pickedPeriod, setPickedPeriod] = useState<PeriodId>()

  const slotsByDay = useMemo(() => {
    const byDay = new Map<string, Array<SlotSchema>>()
    for (const slot of slots) {
      const key = dayKey(new Date(slot.start))
      byDay.set(key, [...(byDay.get(key) ?? []), slot])
    }
    return byDay
  }, [slots])

  // the calendar can't wander outside the bookable range
  const [firstDay, lastDay] = useMemo(() => {
    const [first] = slots
    const last = slots.findLast(Boolean)
    return [first && new Date(first.start), last && new Date(last.start)]
  }, [slots])

  // the chosen time's day (a restored draft), else the day picked, else the first free day
  const day = value
    ? new Date(value)
    : pickedDay && slotsByDay.has(dayKey(pickedDay))
      ? pickedDay
      : firstDay
  const daySlots = (day && slotsByDay.get(dayKey(day))) || []

  // only the periods this day has times in; the chosen time's period, else the one picked,
  // else the first
  const periods = PERIODS.filter((period) =>
    daySlots.some((slot) => periodOf(slot.start) === period.id),
  )
  const [firstPeriod] = periods
  const period = value
    ? periodOf(value)
    : periods.some((each) => each.id === pickedPeriod)
      ? pickedPeriod
      : firstPeriod?.id
  const periodSlots = daySlots.filter((slot) => periodOf(slot.start) === period)

  const isDayFull = useCallback(
    (date: Date) => !slotsByDay.has(dayKey(date)),
    [slotsByDay],
  )
  const pickDay = useCallback(
    (picked: Date | undefined) => {
      if (!picked) return // a second tap on the chosen day keeps it
      setPickedDay(picked)
      onChange("") // a new day: pick its time again
    },
    [onChange],
  )
  const onPeriod = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPickedPeriod(event.target.value as PeriodId)
      onChange("")
    },
    [onChange],
  )
  const onTime = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
    [onChange],
  )

  if (loading) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading free times"
        className="flex flex-col gap-3"
      >
        <div className="h-72 animate-pulse rounded-lg bg-white/60" />
        <div className="grid grid-cols-4 gap-2">
          {PLACEHOLDERS.map((index) => (
            <div
              key={index}
              className="h-11 animate-pulse rounded-lg bg-white/60"
            />
          ))}
        </div>
      </div>
    )
  }
  if (failed) {
    return (
      <p
        role="alert"
        className="text-sm"
      >
        The calendar couldn&apos;t load. Try again later.
      </p>
    )
  }
  if (!day) {
    return <p className="text-sm">No free time in the next four weeks.</p>
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Calendar
        mode="single"
        required
        selected={day}
        onSelect={pickDay}
        disabled={isDayFull}
        defaultMonth={day}
        startMonth={firstDay}
        endMonth={lastDay}
        showOutsideDays={false}
        weekStartsOn={1}
        className="text-content-900 [&_[data-selected-single=true]]:bg-content-900 rounded-lg bg-white p-2 [--cell-size:--spacing(9)] sm:[--cell-size:--spacing(10)] [&_[data-selected-single=true]]:text-white [[data-slot=card-content]_&]:bg-white"
        classNames={CALENDAR_CLASSES}
      />

      <fieldset>
        <legend className="sr-only">Part of the day</legend>
        <div className="flex gap-2">
          {periods.map((each) => (
            <label
              key={each.id}
              className={cn(CHIP, "flex-1 text-sm font-semibold")}
            >
              <input
                type="radio"
                name={`${name}-period`}
                value={each.id}
                checked={each.id === period}
                onChange={onPeriod}
                className="sr-only"
              />
              {each.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="sr-only">
          Time on {format(day, "EEEE d MMMM")}
        </legend>
        <div className="grid grid-cols-4 gap-2">
          {periodSlots.map((slot) => (
            <label
              key={slot.start}
              className={cn(CHIP, "text-sm font-semibold tabular-nums")}
            >
              <input
                type="radio"
                name={`${name}-time`}
                value={slot.start}
                checked={slot.start === value}
                onChange={onTime}
                className="sr-only"
              />
              {format(new Date(slot.start), "HH:mm")}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
