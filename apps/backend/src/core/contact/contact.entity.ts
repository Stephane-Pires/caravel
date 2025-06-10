import { z } from "@hono/zod-openapi"

import type { ContactDb } from "../../db/schema/contact.js"

export const ContactSchema = z.object({
  email: z.string().email().min(1).max(256),
})

type Contact = z.infer<typeof ContactSchema>

export const ContactDTOSchema = ContactSchema.extend({
  email: ContactSchema.shape.email.openapi({
    example: "john.doe@gmail.com",
  }),
}).openapi("ContactDTO")

type ContactDTO = z.infer<typeof ContactDTOSchema>

export class ContactEntity {
  constructor() {}

  static fromRepository(data: ContactDb): Contact {
    return ContactSchema.parse(data)
  }

  static toDto(contact: Contact): ContactDTO {
    return ContactDTOSchema.parse(contact)
  }
}
