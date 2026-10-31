import { getDbClient } from "../../db/db.client.ts"
import { dbSchema } from "../../db/db.schema.ts"

export const getContactsRepository = async () => {
  return await getDbClient().select().from(dbSchema.contact).execute()
}
