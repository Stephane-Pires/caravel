import { OpenAPIHono } from "@hono/zod-openapi"

import { ContactEntity } from "./contact.entity.ts"
import { getContactsRoute } from "./contact.route.ts"
import { getContactsService } from "./contact.service.ts"

const app = new OpenAPIHono()

app.openapi(getContactsRoute, async (c) => {
  const contacts = await getContactsService()

  return c.json(contacts.map(ContactEntity.toDto))
})

export default app
