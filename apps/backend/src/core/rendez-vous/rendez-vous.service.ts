import {
  type CreateRendezVousPayload,
  RendezVousEntity,
} from "./rendez-vous.entity.js"
import {
  getRendezVousRepository,
  persistRendezVousRepository,
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

  if (invariantResult.success === false) {
    return invariantResult.exception
  }

  const persistedRendezVous = await persistRendezVousRepository(payload)

  return await getRendezVousService({
    filter: {
      // TODO : Find a way to check or handle exception in case persistRendezVousRepository fails
      ids: [persistedRendezVous![0].id],
    },
  })
}
