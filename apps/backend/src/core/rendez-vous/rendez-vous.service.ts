import { DatabaseException } from "../../utils/exception.js"
import {
  type CreateRendezVousPayload,
  type MoveRendezVousPayload,
  type RendezVous,
  RendezVousEntity,
} from "./rendez-vous.entity.js"
import {
  RendezVousInvalidScheduleAtAlreadyTakenException,
  RendezVousNotFoundException,
} from "./rendez-vous.exception.js"
import {
  deleteRendezVousRepository,
  getRendezVousRepository,
  persistRendezVousRepository,
  updateRendezVousRepository,
} from "./rendez-vous.repository.js"

interface GetRendezVousServiceOptions {
  filter?: {
    ids?: Array<number>
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
  const invariantResult = RendezVousEntity.checkInvariants(payload)

  if (!invariantResult.success) return invariantResult.exception

  const persistedRendezVous = await persistRendezVousRepository(payload)

  if (persistedRendezVous instanceof DatabaseException) {
    return persistedRendezVous
  }

  const createdRendezVous = await getRendezVousService({
    filter: {
      ids: [persistedRendezVous[0].id],
    },
  })

  return createdRendezVous[0]
}

export async function deleteRendezVousService(ids: Array<RendezVous["id"]>) {
  try {
    const rendezVousDb = await getRendezVousRepository({
      filter: {
        ids,
      },
    })

    if (rendezVousDb.length !== ids.length) {
      return new RendezVousNotFoundException()
    }

    await deleteRendezVousRepository(ids)
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
    const rendezVousDb = await getRendezVousRepository({
      filter: {
        ids: [id],
      },
    })

    if (rendezVousDb.length === 0) {
      return new RendezVousNotFoundException()
    }

    const invariantResult = RendezVousEntity.checkInvariants({
      ...RendezVousEntity.fromRepository(rendezVousDb[0]),
      ...payload,
    })

    if (!invariantResult.success) {
      return invariantResult.exception
    }

    const movedRendezVousDb = await updateRendezVousRepository([[id, payload]])

    if (movedRendezVousDb instanceof DatabaseException) {
      // extract PostgreSQL error code
      // extract PostgreSQL database contraint name

      if (movedRendezVousDb.cause && movedRendezVousDb.cause.code === "23505") {
        switch (movedRendezVousDb.cause.constraint) {
          case "rendez_vous_scheduledAt_unique":
            return new RendezVousInvalidScheduleAtAlreadyTakenException()
        }
      }

      return movedRendezVousDb
    }

    const movedRendezVous = movedRendezVousDb.map(
      RendezVousEntity.fromRepository,
    )

    return movedRendezVous[0]
  } catch (error) {
    // Not correct should be ServiceException
    return new DatabaseException("Error moving rendez-vous", { cause: error })
  }
}
