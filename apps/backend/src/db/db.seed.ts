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
}
