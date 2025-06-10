import { OpenAPIHono } from "@hono/zod-openapi"

import { RendezVousEntity } from "./rendez-vous.entity.js"
import { RendezVousNotFoundExceptionSchema } from "./rendez-vous.exception.js"
import {
  getRendezVousByIdRoute,
  getRendezVousRoute,
  postRendezVousRoute,
} from "./rendez-vous.route.js"
import {
  createRendezVousService,
  getRendezVousService,
} from "./rendez-vous.service.js"

const app = new OpenAPIHono()

app.openapi(getRendezVousRoute, async (c) => {
  const rendezVous = await getRendezVousService()

  return c.json(rendezVous.map(RendezVousEntity.toDto))
})

app.openapi(getRendezVousByIdRoute, async (c) => {
  const { id } = c.req.valid("param")

  const rendezVous = await getRendezVousService({
    filter: {
      ids: [id],
    },
  })

  if (rendezVous.length === 0) {
    return c.json(
      RendezVousNotFoundExceptionSchema.parse({
        title: "RendezVousNotFoundException",
        code: "1001",
        message: "Rendez-vous not found",
      }),
      404,
    )
  }

  return c.json(RendezVousEntity.toDto(rendezVous[0]), 200)
})

app.openapi(postRendezVousRoute, async (c) => {
  const payload = c.req.valid("json")

  const result = await createRendezVousService(payload)

  // Weak way of finding if the result is an error consider Neverthrow OR wrap in RESULT pattern
  if ("code" in result) {
    return c.json(result, 422)
  }

  return c.json(RendezVousEntity.toDto(result[0]), 201)
})

export default app
