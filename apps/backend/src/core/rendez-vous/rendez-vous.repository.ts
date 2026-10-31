import { SQL, and, between, count, eq, gt, inArray } from "drizzle-orm"

import { getDbClient } from "../../db/db.client.js"
import { dbSchema } from "../../db/db.schema.js"
import { DatabaseException, databaseCause } from "../../utils/exception.js"
import type {
  CreateRendezVousPayload,
  RendezVous,
  UpdateRendezVous,
} from "./rendez-vous.entity.js"

interface GetRendezVousRepositoryOptions {
  filter?: {
    ids?: Array<RendezVous["id"]>
    dateRange?: { start: Date; end: Date }
  }
}

export const getRendezVousRepository = async (
  options?: GetRendezVousRepositoryOptions,
) => {
  const db = getDbClient()
  let query = db.select().from(dbSchema.rendezVous)

  // https://orm.drizzle.team/docs/guides/conditional-filters-in-query
  const filters: SQL[] = []

  if (options?.filter?.ids?.length) {
    filters.push(inArray(dbSchema.rendezVous.id, options.filter.ids))
  }

  if (options?.filter?.dateRange) {
    filters.push(
      between(
        dbSchema.rendezVous.scheduledAt,
        options.filter.dateRange.start,
        options.filter.dateRange.end,
      ),
    )
  }

  // if (options?.filter?.dateRange) {
  //   const [start, end] = options.filter.dateRange
  //   filters.push(dbSchema.rendezVous.scheduledAt.between(start, end))
  // }

  // if (options?.filter?.ids?.length) {
  //   query.where(inArray(dbSchema.rendezVous.id, options.filter.ids))
  // }

  // if (options?.filter?.dateRange) {
  //   const [start, end] = options.filter.dateRange
  //   query.where(dbSchema.rendezVous.scheduledAt.between(start, end))
  // }

  query.where(and(...filters))

  return await query.execute()
}

// the stored token hash of one rendez-vous (kept out of the entity, so it never reaches a DTO)
export const getManageTokenHashRepository = async (id: RendezVous["id"]) => {
  const [row] = await getDbClient()
    .select({ manageTokenHash: dbSchema.rendezVous.manageTokenHash })
    .from(dbSchema.rendezVous)
    .where(eq(dbSchema.rendezVous.id, id))
    .execute()
  return row?.manageTokenHash ?? null
}

export const countUpcomingRendezVousRepository = async (
  contactEmail: RendezVous["contactEmail"],
) => {
  const [row] = await getDbClient()
    .select({ total: count() })
    .from(dbSchema.rendezVous)
    .where(
      and(
        eq(dbSchema.rendezVous.contactEmail, contactEmail),
        gt(dbSchema.rendezVous.scheduledAt, new Date()),
      ),
    )
    .execute()
  return row?.total ?? 0
}

export const persistRendezVousRepository = async (
  data: CreateRendezVousPayload,
  manageTokenHash: string,
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
        manageTokenHash,
      })
      .returning({ id: dbSchema.rendezVous.id })
      .execute()
  } catch (error) {
    console.error("RendezVous Repository Error", error)
    return new DatabaseException("Failed to persist rendez-vous", {
      cause: databaseCause(error),
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
      cause: databaseCause(error),
    })
  }
}

export const updateRendezVousRepository = async (
  rendezVousToUpdate: Array<[RendezVous["id"], UpdateRendezVous]>,
) => {
  const db = getDbClient()

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
      cause: databaseCause(error),
    })
  }
}
