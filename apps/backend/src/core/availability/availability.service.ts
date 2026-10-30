import dayjs, { type Dayjs } from "dayjs"
import timezone from "dayjs/plugin/timezone.js"
import utc from "dayjs/plugin/utc.js"

import { getOverlappingRendezVousRepository } from "../rendez-vous/rendez-vous.repository.js"
import { AVAILABILITY } from "./availability.config.js"

dayjs.extend(utc)
dayjs.extend(timezone)

export interface Slot {
  start: Date
  end: Date
}

const MINUTES_PER_HOUR = 60

const minutesOf = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * MINUTES_PER_HOUR + minutes
}

// the window in which slots may start: not before the notice period, not past the horizon
function bookableWindow(now = dayjs()) {
  return {
    earliest: now.add(AVAILABILITY.minNoticeHours, "hour"),
    latest: now.add(AVAILABILITY.horizonDays, "day"),
  }
}

export const slotEnd = (start: Date) =>
  dayjs(start).add(AVAILABILITY.slotMinutes, "minute").toDate()

// every slot the availability offers between two instants, before removing bookings
function offeredSlots(from: Dayjs, to: Dayjs): Array<Slot> {
  const { timeZone, days, start, end, slotMinutes } = AVAILABILITY
  const slots: Array<Slot> = []
  const lastDay = to.tz(timeZone).startOf("day")
  for (
    let day = from.tz(timeZone).startOf("day");
    !day.isAfter(lastDay);
    day = day.add(1, "day")
  ) {
    if (!(days as ReadonlyArray<number>).includes(day.day())) continue
    for (
      let minute = minutesOf(start);
      minute + slotMinutes <= minutesOf(end);
      minute += slotMinutes
    ) {
      // build the wall-clock time in the captain's zone (DST-safe), then compare as instants
      const slotStart = dayjs.tz(
        `${day.format("YYYY-MM-DD")} ${String(Math.floor(minute / MINUTES_PER_HOUR)).padStart(2, "0")}:${String(minute % MINUTES_PER_HOUR).padStart(2, "0")}`,
        timeZone,
      )
      if (slotStart.isBefore(from) || slotStart.isAfter(to)) continue
      slots.push({
        start: slotStart.toDate(),
        end: slotEnd(slotStart.toDate()),
      })
    }
  }
  return slots
}

const overlaps = (slot: Slot, busy: Slot) =>
  slot.start < busy.end && busy.start < slot.end

// the free slots between two instants (clamped to what can be booked now)
export async function getFreeSlotsService(range?: { from?: Date; to?: Date }) {
  const { earliest, latest } = bookableWindow()
  const from =
    range?.from && dayjs(range.from).isAfter(earliest)
      ? dayjs(range.from)
      : earliest
  const to =
    range?.to && dayjs(range.to).isBefore(latest) ? dayjs(range.to) : latest
  if (!from.isBefore(to)) return []

  const busy = await getOverlappingRendezVousRepository(
    from.toDate(),
    slotEnd(to.toDate()),
  )
  return offeredSlots(from, to).filter(
    (slot) => !busy.some((booked) => overlaps(slot, booked)),
  )
}

// is this instant the start of a slot the captain offers right now (ignoring bookings)?
export function isOfferedSlotStart(start: Date) {
  const { earliest, latest } = bookableWindow()
  const instant = dayjs(start)
  if (instant.isBefore(earliest) || instant.isAfter(latest)) return false
  return offeredSlots(instant, instant).some(
    (slot) => slot.start.getTime() === start.getTime(),
  )
}
