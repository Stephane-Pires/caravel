import { eq, inArray } from "drizzle-orm"
import { DatabaseError } from "pg"

import { getDbClient } from "../../db/db.client.js"
import { dbSchema } from "../../db/db.schema.js"
import { DatabaseException } from "../../utils/exception.js"
import type {
  CreateRendezVousPayload,
  RendezVous,
  UpdateRendezVous,
} from "./rendez-vous.entity.js"

interface GetRendezVousRepositoryOptions {
  filter?: {
    ids?: Array<number>
  }
}

export const getRendezVousRepository = async (
  options?: GetRendezVousRepositoryOptions,
) => {
  const db = getDbClient()
  let query = db.select().from(dbSchema.rendezVous)

  if (options?.filter?.ids?.length) {
    query.where(inArray(dbSchema.rendezVous.id, options.filter.ids))
  }

  return await query.execute()
}

export const persistRendezVousRepository = async (
  data: CreateRendezVousPayload,
) => {
  const db = getDbClient()

  try {
    await db
      .insert(dbSchema.contact)
      .values({ email: data.contactEmail })
      .onConflictDoNothing()
      .execute()

    return await db
      .insert(dbSchema.rendezVous)
      .values({
        contactEmail: data.contactEmail,
        scheduledAt: data.scheduledAt,
      })
      .returning({ id: dbSchema.rendezVous.id })
      .execute()
  } catch (error) {
    console.error("RendezVous Repository Error", error)
    return new DatabaseException("Failed to persist rendez-vous", {
      cause: error.cause,
    })
  }
}

export const deleteRendezVousRepository = async (
  ids: Array<RendezVous["id"]>,
) => {
  const db = getDbClient()

  try {
    await db
      .delete(dbSchema.rendezVous)
      .where(inArray(dbSchema.rendezVous.id, ids))
      .execute()
  } catch (error) {
    console.error("RendezVous Repository Error", error)
    // https://github.com/drizzle-team/drizzle-orm/issues/376
    throw new DatabaseException("Failed to delete rendez-vous", {
      cause: error.cause,
    })
  }
}

export const updateRendezVousRepository = async (
  rendezVousToUpdate: Array<[RendezVous["id"], UpdateRendezVous]>,
) => {
  const db = getDbClient()

  console.log("Updating rendez-vous:", rendezVousToUpdate)
  try {
    const results = await Promise.all(
      rendezVousToUpdate.map(([id, update]) =>
        db
          .update(dbSchema.rendezVous)
          .set(update)
          .where(eq(dbSchema.rendezVous.id, id))
          .returning()
          .execute(),
      ),
    )
    return results.flat()
  } catch (error: unknown) {
    console.error("RendezVous Repository Error", error)

    return new DatabaseException("Failed to update rendez-vous", {
      cause: error.cause instanceof DatabaseError ? error.cause : undefined,
    })
  }
}
