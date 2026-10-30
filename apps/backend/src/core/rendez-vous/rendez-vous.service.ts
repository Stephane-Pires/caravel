import { DatabaseException, databaseCause } from "../../utils/exception.js"
import { MailService } from "../../utils/mail.js"
import { createManageToken, tokenMatches } from "../../utils/token.js"
import { passesTurnstile } from "../../utils/turnstile.js"
import {
  type CreateRendezVousPayload,
  type MoveRendezVousPayload,
  type RendezVous,
  RendezVousEntity,
} from "./rendez-vous.entity.js"
import {
  RendezVousNotFoundException,
  RendezVousSpamCheckFailedException,
  RendezVousTooManyException,
} from "./rendez-vous.exception.js"
import {
  countUpcomingRendezVousRepository,
  deleteRendezVousRepository,
  getManageTokenHashRepository,
  getRendezVousRepository,
  persistRendezVousRepository,
  updateRendezVousRepository,
} from "./rendez-vous.repository.js"

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
  const persistedRendezVous = await persistRendezVousRepository(payload, hash)

  if (persistedRendezVous instanceof DatabaseException)
    return persistedRendezVous

  const createdRendezVousList = await getRendezVousService({
    filter: {
      ids: [persistedRendezVous[0].id],
    },
  })

  const createdRendezVous = createdRendezVousList[0]

  await MailService.sendRendezVousCreated(createdRendezVous)

  return { ...createdRendezVous, manageToken }
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

    await deleteRendezVousRepository(ids)

    await MailService.sendCancelRendezVous(rendezVousList)
  } catch (error) {
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
    })

    if (!invariantResult.success) return invariantResult.exception

    const movedRendezVousDb = await updateRendezVousRepository([[id, payload]])

    if (movedRendezVousDb instanceof DatabaseException) return movedRendezVousDb

    const movedRendezVousList = movedRendezVousDb.map(
      RendezVousEntity.fromRepository,
    )

    const movedRendezVous = movedRendezVousList[0]

    MailService.sendRendezVousMoved(rendezVousToUpdate, movedRendezVous)

    return movedRendezVous
  } catch (error) {
    // Not correct should be ServiceException
    return new DatabaseException("Error moving rendez-vous", {
      cause: databaseCause(error),
    })
  }
}
