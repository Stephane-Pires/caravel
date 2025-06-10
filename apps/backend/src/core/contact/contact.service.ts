import { ContactEntity } from "./contact.entity.js"
import { getContactsRepository } from "./contact.repository.js"

export async function getContactsService() {
  const contactsDb = await getContactsRepository()

  const contacts = contactsDb.map(ContactEntity.fromRepository)

  return contacts
}
