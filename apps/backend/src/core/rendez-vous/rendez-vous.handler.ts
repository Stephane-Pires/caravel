import { OpenAPIHono } from "@hono/zod-openapi"

import { DatabaseException } from "../../utils/exception.js"
import { RendezVousEntity } from "./rendez-vous.entity.js"
import {
  RendezVousInvalidScheduleAtAlreadyTakenException,
  RendezVousInvalidScheduleAtException,
  RendezVousNotFoundException,
} from "./rendez-vous.exception.js"
import {
  cancelRendezVousRoute,
  getRendezVousByIdRoute,
  getRendezVousRoute,
  moveRendezVousRoute,
  postRendezVousRoute,
} from "./rendez-vous.route.js"
import {
  cancelRendezVousService,
  createRendezVousService,
  getRendezVousService,
  moveRendezVousService,
} from "./rendez-vous.service.js"

const app = new OpenAPIHono()

app.openapi(getRendezVousRoute, async (c) => {
  const { "dateRange[start]": dateRangeStart, "dateRange[end]": dateRangeEnd } =
    c.req.valid("query")

  const options = {
    filter: {
      dateRange:
        dateRangeStart && dateRangeEnd
          ? {
              start: new Date(dateRangeStart),
              end: new Date(dateRangeEnd),
            }
          : undefined,
    },
  }

  const rendezVous = await getRendezVousService(options)

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
    return c.json(new RendezVousNotFoundException().toDTO(), 404)
  }

  return c.json(RendezVousEntity.toDto(rendezVous[0]), 200)
})

app.openapi(postRendezVousRoute, async (c) => {
  const payload = c.req.valid("json")

  const result = await createRendezVousService(payload)

  if (result instanceof RendezVousInvalidScheduleAtAlreadyTakenException) {
    return c.json(result, 409)
  }

  if (result instanceof RendezVousInvalidScheduleAtException) {
    return c.json(result, 422)
  }

  if (result instanceof DatabaseException) {
    return c.json(result, 500)
  }

  return c.json(RendezVousEntity.toDto(result), 201)
})

app.openapi(cancelRendezVousRoute, async (c) => {
  const { id } = c.req.valid("param")

  const rendezVous = await getRendezVousService({
    filter: {
      ids: [id],
    },
  })

  if (rendezVous.length === 0) {
    return c.json(new RendezVousNotFoundException().toDTO(), 404)
  }

  await cancelRendezVousService([id])

  return c.newResponse(null, 204)
})

app.openapi(moveRendezVousRoute, async (c) => {
  const { id } = c.req.valid("param")
  const payload = c.req.valid("json")

  const movedRendezVous = await moveRendezVousService(id, payload)

  if (movedRendezVous instanceof RendezVousNotFoundException) {
    return c.json(movedRendezVous.toDTO(), 404)
  }
  if (
    movedRendezVous instanceof RendezVousInvalidScheduleAtAlreadyTakenException
  ) {
    return c.json(movedRendezVous.toDTO(), 409)
  }
  if (movedRendezVous instanceof RendezVousInvalidScheduleAtException) {
    return c.json(movedRendezVous.toDTO(), 422)
  }
  if (movedRendezVous instanceof DatabaseException) {
    return c.json(movedRendezVous, 500)
  }

  return c.json(RendezVousEntity.toDto(movedRendezVous), 200)
})

export default app
