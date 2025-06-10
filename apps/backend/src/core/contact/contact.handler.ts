import { OpenAPIHono } from "@hono/zod-openapi"

import { ContactEntity } from "./contact.entity.js"
import { getContactsRoute } from "./contact.route.js"
import { getContactsService } from "./contact.service.js"

const app = new OpenAPIHono()

app.openapi(getContactsRoute, async (c) => {
  const contacts = await getContactsService()

  return c.json(contacts.map(ContactEntity.toDto))
})

export default app
