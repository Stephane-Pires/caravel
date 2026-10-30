// When the captain can be booked. Times are wall-clock times in `timeZone`, so they follow
// daylight saving: 08:00 in Paris stays 08:00 in Paris all year.
export const AVAILABILITY = {
  timeZone: "Europe/Paris",
  // 0 = Sunday … 6 = Saturday
  days: [0, 1, 2, 3, 4, 5, 6],
  start: "08:00",
  end: "20:00",
  slotMinutes: 30,
  minNoticeHours: 12,
  horizonDays: 28,
} as const
