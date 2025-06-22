import { DatabaseException } from "../../utils/exception.js"
import { MailService } from "../../utils/mail.js"
import {
  type CreateRendezVousPayload,
  type MoveRendezVousPayload,
  type RendezVous,
  RendezVousEntity,
} from "./rendez-vous.entity.js"
import { RendezVousNotFoundException } from "./rendez-vous.exception.js"
import {
  deleteRendezVousRepository,
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

export async function createRendezVousService(
  payload: CreateRendezVousPayload,
) {
  const invariantResult = await RendezVousEntity.checkInvariants(payload)

  if (!invariantResult.success) return invariantResult.exception

  const persistedRendezVous = await persistRendezVousRepository(payload)

  if (persistedRendezVous instanceof DatabaseException)
    return persistedRendezVous

  const createdRendezVousList = await getRendezVousService({
    filter: {
      ids: [persistedRendezVous[0].id],
    },
  })

  const createdRendezVous = createdRendezVousList[0]

  await MailService.sendRendezVousCreated(createdRendezVous)

  return createdRendezVous
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
    throw new DatabaseException("Error deleting rendez-vous", { cause: error })
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
    return new DatabaseException("Error moving rendez-vous", { cause: error })
  }
}
