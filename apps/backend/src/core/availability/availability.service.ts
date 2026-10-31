import dayjs, { type Dayjs } from "dayjs"
import timezone from "dayjs/plugin/timezone.js"
import utc from "dayjs/plugin/utc.js"

import { getCalendar } from "../../utils/google-calendar.ts"
import { reportError } from "../../utils/report.ts"
import {
  deleteEndedRendezVousRepository,
  getOverlappingRendezVousRepository,
} from "../rendez-vous/rendez-vous.repository.ts"
import { AVAILABILITY } from "./availability.config.ts"

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

// the privacy page promises it: a guest's name, email and topic are kept until
// 30 days after the rendez-vous. Cleaned whenever someone looks for a slot (no cron needed).
const RETENTION_DAYS = 30

async function forgetEndedRendezVous() {
  try {
    await deleteEndedRendezVousRepository(
      dayjs().subtract(RETENTION_DAYS, "day").toDate(),
    )
  } catch (error) {
    reportError(error, "Ended rendez-vous couldn't be forgotten")
  }
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

  await forgetEndedRendezVous()

  const booked = await getOverlappingRendezVousRepository(
    from.toDate(),
    slotEnd(to.toDate()),
  )
  // the captain's own calendar: meetings, trips… If Google can't be reached, the bookings
  // alone decide, and booking that slot is then checked again (and refused if Google is still down)
  let elsewhere: Array<Slot> = []
  try {
    elsewhere = await getCalendar().busyRanges(
      from.toDate(),
      slotEnd(to.toDate()),
    )
  } catch (error) {
    reportError(
      error,
      "Busy times unavailable, offering slots from bookings only",
    )
  }
  const busy = [...booked, ...elsewhere]
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
