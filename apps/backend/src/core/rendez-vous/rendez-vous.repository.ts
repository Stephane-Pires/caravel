import { inArray } from "drizzle-orm"

import { getDbClient } from "../../db/db.client.js"
import { dbSchema } from "../../db/db.schema.js"
import type { CreateRendezVousPayload } from "./rendez-vous.entity.js"

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
  }
}
