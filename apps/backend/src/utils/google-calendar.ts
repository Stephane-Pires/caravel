import { randomUUID } from "node:crypto"

import { assertEnv } from "./env.js"

// The captain's Google Calendar: each rendez-vous is an event there, with a Google Meet link and
// the guest invited, so Google sends the invitation, the updates, the cancellation and the reminders.
// Plain REST calls with fetch (no SDK). Without Google credentials (local development, tests)
// a recording stub stands in, so nothing is sent.

export interface CalendarEventInput {
  start: Date
  end: Date
  guestEmail: string
  guestName: string
  topic?: string | null
  rendezVousId: number
}

export interface CalendarEvent {
  eventId: string
  meetLink: string | null
}

export interface BusyRange {
  start: Date
  end: Date
}

export interface Calendar {
  createEvent(input: CalendarEventInput): Promise<CalendarEvent>
  moveEvent(eventId: string, start: Date, end: Date): Promise<void>
  cancelEvent(eventId: string): Promise<void>
  // ranges where the captain is busy, ignoring free (transparent) events and the given events
  busyRanges(
    from: Date,
    to: Date,
    ignoreEventIds?: Array<string>,
  ): Promise<Array<BusyRange>>
}

const API = "https://www.googleapis.com/calendar/v3"
const SECONDS = 1000
const TOKEN_MARGIN_MS = 60 * SECONDS // refresh a minute before the access token expires
const REMINDERS = [
  { method: "email", minutes: 24 * 60 }, // the day before
  { method: "popup", minutes: 15 },
]

export class CalendarUnavailableError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = "CalendarUnavailableError"
  }
}

function googleCalendar(credentials: {
  clientId: string
  clientSecret: string
  refreshToken: string
  calendarId: string
}): Calendar {
  let token: { value: string; expiresAt: number } | null = null

  async function accessToken() {
    if (token && Date.now() < token.expiresAt - TOKEN_MARGIN_MS)
      return token.value
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        refresh_token: credentials.refreshToken,
        grant_type: "refresh_token",
      }),
    })
    const json = (await response.json()) as {
      access_token?: string
      expires_in?: number
      error?: string
    }
    if (!response.ok || !json.access_token) {
      throw new CalendarUnavailableError(
        `Google refused the refresh token (${json.error ?? response.status})`,
      )
    }
    token = {
      value: json.access_token,
      expiresAt: Date.now() + (json.expires_in ?? 0) * SECONDS,
    }
    return token.value
  }

  async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
    let response: Response
    try {
      response = await fetch(`${API}${path}`, {
        ...init,
        headers: {
          authorization: `Bearer ${await accessToken()}`,
          "content-type": "application/json",
          ...init.headers,
        },
      })
    } catch (error) {
      throw new CalendarUnavailableError("Google Calendar is unreachable", {
        cause: error,
      })
    }
    // an event already gone counts as cancelled
    if (
      init.method === "DELETE" &&
      (response.status === 404 || response.status === 410)
    ) {
      return undefined as T
    }
    if (!response.ok) {
      throw new CalendarUnavailableError(
        `Google Calendar answered ${response.status} on ${init.method ?? "GET"} ${path.split("?")[0]}`,
      )
    }
    return (response.status === 204 ? undefined : await response.json()) as T
  }

  const events = `/calendars/${encodeURIComponent(credentials.calendarId)}/events`

  return {
    async createEvent(input) {
      const description = [
        `Rendez-vous booked on Caravel by ${input.guestName} (${input.guestEmail}).`,
        input.topic ? `Topic: ${input.topic}` : null,
      ]
        .filter(Boolean)
        .join("\n\n")
      const event = await call<{ id: string; hangoutLink?: string }>(
        `${events}?conferenceDataVersion=1&sendUpdates=all`,
        {
          method: "POST",
          body: JSON.stringify({
            summary: `Caravel · ${input.guestName} & Stéphane Pires`,
            description,
            start: { dateTime: input.start.toISOString() },
            end: { dateTime: input.end.toISOString() },
            attendees: [
              { email: input.guestEmail, displayName: input.guestName },
            ],
            conferenceData: {
              createRequest: {
                requestId: randomUUID(),
                conferenceSolutionKey: { type: "hangoutsMeet" },
              },
            },
            reminders: { useDefault: false, overrides: REMINDERS },
            guestsCanModify: false,
            extendedProperties: {
              private: { rendezVousId: String(input.rendezVousId) },
            },
          }),
        },
      )
      return { eventId: event.id, meetLink: event.hangoutLink ?? null }
    },

    async moveEvent(eventId, start, end) {
      await call(`${events}/${encodeURIComponent(eventId)}?sendUpdates=all`, {
        method: "PATCH",
        body: JSON.stringify({
          start: { dateTime: start.toISOString() },
          end: { dateTime: end.toISOString() },
        }),
      })
    },

    async cancelEvent(eventId) {
      await call(`${events}/${encodeURIComponent(eventId)}?sendUpdates=all`, {
        method: "DELETE",
      })
    },

    async busyRanges(from, to, ignoreEventIds = []) {
      const ranges: Array<BusyRange> = []
      let pageToken: string | undefined
      do {
        const query = new URLSearchParams({
          timeMin: from.toISOString(),
          timeMax: to.toISOString(),
          singleEvents: "true",
          orderBy: "startTime",
          maxResults: "2500",
          fields:
            "nextPageToken,items(id,status,transparency,start,end,attendees(self,responseStatus))",
        })
        if (pageToken) query.set("pageToken", pageToken)
        const page = await call<{
          nextPageToken?: string
          items: Array<{
            id: string
            status?: string
            transparency?: string
            start: { dateTime?: string; date?: string }
            end: { dateTime?: string; date?: string }
            attendees?: Array<{ self?: boolean; responseStatus?: string }>
          }>
        }>(`${events}?${query}`)
        for (const event of page.items) {
          if (ignoreEventIds.includes(event.id)) continue
          if (
            event.status === "cancelled" ||
            event.transparency === "transparent"
          )
            continue
          // invitations the captain declined don't make him busy
          if (
            event.attendees?.some(
              (a) => a.self && a.responseStatus === "declined",
            )
          )
            continue
          const start = event.start.dateTime ?? event.start.date
          const end = event.end.dateTime ?? event.end.date
          if (start && end)
            ranges.push({ start: new Date(start), end: new Date(end) })
        }
        pageToken = page.nextPageToken
      } while (pageToken)
      return ranges
    },
  }
}

// local development and tests: remembers what would have been sent to Google
export interface RecordingCalendar extends Calendar {
  calls: Array<{ action: string; eventId?: string; input?: unknown }>
  busy: Array<BusyRange>
}

function recordingCalendar(): RecordingCalendar {
  const calls: RecordingCalendar["calls"] = []
  const busy: Array<BusyRange> = []
  return {
    calls,
    busy,
    async createEvent(input) {
      const eventId = `stub-${input.rendezVousId}-${randomUUID().slice(0, 8)}`
      calls.push({ action: "create", eventId, input })
      return {
        eventId,
        meetLink: `https://meet.google.com/stub-${input.rendezVousId}`,
      }
    },
    async moveEvent(eventId, start, end) {
      calls.push({ action: "move", eventId, input: { start, end } })
    },
    async cancelEvent(eventId) {
      calls.push({ action: "cancel", eventId })
    },
    async busyRanges(from, to) {
      return busy.filter((range) => range.start < to && from < range.end)
    },
  }
}

let calendar: Calendar | null = null

export function getCalendar(): Calendar {
  if (calendar) return calendar
  const env = assertEnv(process.env)
  calendar =
    env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_REFRESH_TOKEN
      ? googleCalendar({
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          refreshToken: env.GOOGLE_REFRESH_TOKEN,
          calendarId: env.GOOGLE_CALENDAR_ID,
        })
      : recordingCalendar()
  return calendar
}
