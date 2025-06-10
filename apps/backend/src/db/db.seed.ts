import { sql } from "drizzle-orm"
import { seed } from "drizzle-seed"

import { getDbClient } from "./db.client.js"
import { dbSchema } from "./db.schema.js"

export async function seedDb() {
  await seed(getDbClient(), dbSchema).refine((funcs) => ({
    contact: {
      columns: {
        email: funcs.email(),
      },
    },
  }))

  await getDbClient()
    .execute(
      sql`SELECT setval(pg_get_serial_sequence('RENDEZ_VOUS', 'id'), coalesce(max(id), 0) + 1, false) FROM RENDEZ_VOUS`,
    )
    .execute()
}
