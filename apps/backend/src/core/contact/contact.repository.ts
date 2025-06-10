import { getDbClient } from "../../db/db.client.js"
import { dbSchema } from "../../db/db.schema.js"

export const getContactsRepository = async () => {
  return await getDbClient().select().from(dbSchema.contact).execute()
}
