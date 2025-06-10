import { createRoute } from "@hono/zod-openapi"

import { API_TAG } from "../../utils/tag.js"
import { ContactDTOSchema } from "./contact.entity.js"

export const getContactsRoute = createRoute({
  method: "get",
  path: "contacts",
  tags: [API_TAG.CONTACT],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ContactDTOSchema.array(),
        },
      },
      description: "Retrieves contacts informations",
    },
  },
})
