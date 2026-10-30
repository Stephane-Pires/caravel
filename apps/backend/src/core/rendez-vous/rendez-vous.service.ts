import { slotEnd } from "../availability/availability.service.ts"
import {
  DatabaseException,
  databaseCause,
  isSlotConflict,
} from "../../utils/exception.ts"
import { assertEnv } from "../../utils/env.ts"
import {
  CalendarUnavailableError,
  getCalendar,
} from "../../utils/google-calendar.ts"
import { createManageToken, tokenMatches } from "../../utils/token.ts"
import { reportError } from "../../utils/report.ts"
import { passesTurnstile } from "../../utils/turnstile.ts"
import {
  type CreateRendezVousPayload,
  type MoveRendezVousPayload,
  type RendezVous,
  RendezVousEntity,
} from "./rendez-vous.entity.ts"
import {
  RendezVousCalendarUnavailableException,
  RendezVousInvalidScheduleAtAlreadyTakenException,
  RendezVousNotFoundException,
  RendezVousSpamCheckFailedException,
  RendezVousTooManyException,
} from "./rendez-vous.exception.ts"
import {
  countUpcomingRendezVousRepository,
  deleteRendezVousRepository,
  getManageTokenHashRepository,
  getRendezVousRepository,
  persistRendezVousRepository,
  updateRendezVousRepository,
} from "./rendez-vous.repository.ts"

interface GetRendezVousServiceOptions {
  filter?: {
    ids?: Array<RendezVous["id"]>
    dateRange?: {
      start: Date
      end: Date
    }
  }
}

export async function getRendezVousService(
  options?: GetRendezVousServiceOptions,
) {
  const rendezVousDb = await getRendezVousRepository(options)

  const rendezVous = rendezVousDb.map(RendezVousEntity.fromRepository)

  return rendezVous
}

// a guest can hold this many upcoming rendez-vous at once: enough to talk, too few to flood the calendar
const MAX_UPCOMING_PER_CONTACT = 2

export async function createRendezVousService(
  payload: CreateRendezVousPayload,
  context: { ip?: string } = {},
) {
  if (!(await passesTurnstile(payload.turnstileToken, context.ip))) {
    return new RendezVousSpamCheckFailedException()
  }

  const invariantResult = await RendezVousEntity.checkInvariants(payload)

  if (!invariantResult.success) return invariantResult.exception

  if (
    (await countUpcomingRendezVousRepository(payload.contactEmail)) >=
    MAX_UPCOMING_PER_CONTACT
  ) {
    return new RendezVousTooManyException()
  }

  const { token: manageToken, hash } = createManageToken()
  const persistedRendezVous = await persistRendezVousRepository(
    { ...payload, endsAt: slotEnd(payload.scheduledAt) },
    hash,
  )

  if (persistedRendezVous instanceof DatabaseException)
    return isSlotConflict(persistedRendezVous)
      ? new RendezVousInvalidScheduleAtAlreadyTakenException() // someone booked it a moment earlier
      : persistedRendezVous

  const createdRendezVousList = await getRendezVousService({
    filter: {
      ids: [persistedRendezVous[0].id],
    },
  })

  const createdRendezVous = createdRendezVousList[0]

  // the event in the captain's calendar: Google invites the guest, adds a Meet link and reminds both.
  // No invitation, no rendez-vous: if Google can't be reached, the booking is undone.
  let event
  try {
    event = await getCalendar().createEvent({
      start: createdRendezVous.scheduledAt,
      end: createdRendezVous.endsAt,
      guestEmail: createdRendezVous.contactEmail,
      guestName: createdRendezVous.guestName ?? createdRendezVous.contactEmail,
      topic: createdRendezVous.topic,
      rendezVousId: createdRendezVous.id,
      manageUrl: manageUrl(createdRendezVous.id, manageToken),
    })
  } catch (error) {
    if (!(error instanceof CalendarUnavailableError)) throw error
    reportError(error)
    await deleteRendezVousRepository([createdRendezVous.id])
    return new RendezVousCalendarUnavailableException()
  }

  const linked = await updateRendezVousRepository([
    [
      createdRendezVous.id,
      { calendarEventId: event.eventId, meetLink: event.meetLink },
    ],
  ])
  if (linked instanceof DatabaseException) return linked

  return {
    ...RendezVousEntity.fromRepository(linked[0]),
    manageToken,
  }
}

// the guest's page to see, reschedule or cancel the rendez-vous. The token rides in the
// fragment (#…), which browsers never send to a server, so it stays out of logs and referrers.
export function manageUrl(id: RendezVous["id"], token: string) {
  const { PUBLIC_SITE_URL } = assertEnv(process.env)
  return new URL(
    `/pourparler/rendez-vous/${id}#${token}`,
    PUBLIC_SITE_URL,
  ).toString()
}

// the rendez-vous a token opens, or nothing: an unknown id and a wrong token look the same,
// so ids can't be probed
export async function findManagedRendezVousService(
  id: RendezVous["id"],
  token: string | undefined,
) {
  const hash = await getManageTokenHashRepository(id)
  if (!tokenMatches(hash, token)) return null
  const [rendezVous] = await getRendezVousService({ filter: { ids: [id] } })
  return rendezVous ?? null
}

export async function cancelRendezVousService(ids: Array<RendezVous["id"]>) {
  try {
    const rendezVousList = await getRendezVousService({
      filter: {
        ids,
      },
    })

    if (rendezVousList.length !== ids.length) {
      return new RendezVousNotFoundException()
    }

    // cancel the calendar events first (Google tells the guests); keep the rows if that fails
    for (const rendezVous of rendezVousList) {
      if (rendezVous.calendarEventId) {
        await getCalendar().cancelEvent(rendezVous.calendarEventId)
      }
    }

    await deleteRendezVousRepository(ids)
  } catch (error) {
    if (error instanceof CalendarUnavailableError) {
      reportError(error)
      return new RendezVousCalendarUnavailableException()
    }
    // Should be a Service Exception
    throw new DatabaseException("Error deleting rendez-vous", {
      cause: databaseCause(error),
    })
  }
}

export async function moveRendezVousService(
  id: RendezVous["id"],
  payload: MoveRendezVousPayload,
) {
  try {
    const rendezVousList = await getRendezVousService({
      filter: {
        ids: [id],
      },
    })

    if (rendezVousList.length === 0) {
      return new RendezVousNotFoundException()
    }

    const rendezVousToUpdate = rendezVousList[0]

    const invariantResult = await RendezVousEntity.checkInvariants({
      ...rendezVousToUpdate,
      ...payload,
    }) // its own id is ignored, so it may move to an overlapping slot of its own

    if (!invariantResult.success) return invariantResult.exception

    const movedRendezVousDb = await updateRendezVousRepository([
      [
        id,
        {
          ...payload,
          endsAt: payload.scheduledAt
            ? slotEnd(payload.scheduledAt)
            : undefined,
        },
      ],
    ])

    if (movedRendezVousDb instanceof DatabaseException)
      return isSlotConflict(movedRendezVousDb)
        ? new RendezVousInvalidScheduleAtAlreadyTakenException()
        : movedRendezVousDb

    const movedRendezVousList = movedRendezVousDb.map(
      RendezVousEntity.fromRepository,
    )

    const movedRendezVous = movedRendezVousList[0]

    // move the calendar event (Google tells the guest); put the rendez-vous back if that fails
    if (movedRendezVous.calendarEventId) {
      try {
        await getCalendar().moveEvent(
          movedRendezVous.calendarEventId,
          movedRendezVous.scheduledAt,
          movedRendezVous.endsAt,
        )
      } catch (error) {
        if (!(error instanceof CalendarUnavailableError)) throw error
        reportError(error)
        await updateRendezVousRepository([
          [
            id,
            {
              scheduledAt: rendezVousToUpdate.scheduledAt,
              endsAt: rendezVousToUpdate.endsAt,
            },
          ],
        ])
        return new RendezVousCalendarUnavailableException()
      }
    }

    return movedRendezVous
  } catch (error) {
    // Not correct should be ServiceException
    return new DatabaseException("Error moving rendez-vous", {
      cause: databaseCause(error),
    })
  }
}
