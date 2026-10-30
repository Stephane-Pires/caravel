import { ContactEntity } from "./contact.entity.ts"
import { getContactsRepository } from "./contact.repository.ts"

export async function getContactsService() {
  const contactsDb = await getContactsRepository()

  const contacts = contactsDb.map(ContactEntity.fromRepository)

  return contacts
}
