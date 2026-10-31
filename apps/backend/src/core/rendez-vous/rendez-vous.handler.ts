import { OpenAPIHono } from "@hono/zod-openapi"

import { DatabaseException } from "../../utils/exception.ts"
import { bearerToken } from "../../utils/token.ts"
import {
  CreatedRendezVousDTOSchema,
  RendezVousEntity,
} from "./rendez-vous.entity.ts"
import {
  RendezVousCalendarUnavailableException,
  RendezVousInvalidScheduleAtAlreadyTakenException,
  RendezVousInvalidScheduleAtException,
  RendezVousNotFoundException,
  RendezVousOutsideAvailabilityException,
  RendezVousTooManyException,
} from "./rendez-vous.exception.ts"
import {
  cancelRendezVousRoute,
  getRendezVousByIdRoute,
  getRendezVousRoute,
  moveRendezVousRoute,
  postRendezVousRoute,
} from "./rendez-vous.route.ts"
import {
  cancelRendezVousService,
  createRendezVousService,
  findManagedRendezVousService,
  getRendezVousService,
  moveRendezVousService,
} from "./rendez-vous.service.ts"

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

  return c.json(rendezVous.map(RendezVousEntity.toBusySlotDto))
})

app.openapi(getRendezVousByIdRoute, async (c) => {
  const { id } = c.req.valid("param")
  const token = bearerToken(c.req.valid("header").authorization)

  const rendezVous = await findManagedRendezVousService(id, token)

  if (!rendezVous) {
    return c.json(new RendezVousNotFoundException().toDTO(), 404)
  }

  return c.json(RendezVousEntity.toDto(rendezVous), 200)
})

app.openapi(postRendezVousRoute, async (c) => {
  const payload = c.req.valid("json")

  const result = await createRendezVousService(payload)

  if (result instanceof RendezVousTooManyException) {
    return c.json(result, 429)
  }

  if (result instanceof RendezVousCalendarUnavailableException) {
    return c.json(result.toDTO(), 503)
  }

  if (result instanceof RendezVousInvalidScheduleAtAlreadyTakenException) {
    return c.json(result, 409)
  }

  if (
    result instanceof RendezVousInvalidScheduleAtException ||
    result instanceof RendezVousOutsideAvailabilityException
  ) {
    return c.json(result, 422)
  }

  if (result instanceof DatabaseException) {
    return c.json(result, 500)
  }

  return c.json(CreatedRendezVousDTOSchema.parse(result), 201)
})

app.openapi(cancelRendezVousRoute, async (c) => {
  const { id } = c.req.valid("param")
  const token = bearerToken(c.req.valid("header").authorization)

  if (!(await findManagedRendezVousService(id, token))) {
    return c.json(new RendezVousNotFoundException().toDTO(), 404)
  }

  const cancelled = await cancelRendezVousService([id])

  if (cancelled instanceof RendezVousCalendarUnavailableException) {
    return c.json(cancelled.toDTO(), 503)
  }

  return c.newResponse(null, 204)
})

app.openapi(moveRendezVousRoute, async (c) => {
  const { id } = c.req.valid("param")
  const payload = c.req.valid("json")
  const token = bearerToken(c.req.valid("header").authorization)

  if (!(await findManagedRendezVousService(id, token))) {
    return c.json(new RendezVousNotFoundException().toDTO(), 404)
  }

  const movedRendezVous = await moveRendezVousService(id, payload)

  if (movedRendezVous instanceof RendezVousNotFoundException) {
    return c.json(movedRendezVous.toDTO(), 404)
  }
  if (
    movedRendezVous instanceof RendezVousInvalidScheduleAtAlreadyTakenException
  ) {
    return c.json(movedRendezVous.toDTO(), 409)
  }
  if (
    movedRendezVous instanceof RendezVousInvalidScheduleAtException ||
    movedRendezVous instanceof RendezVousOutsideAvailabilityException
  ) {
    return c.json(movedRendezVous.toDTO(), 422)
  }
  if (movedRendezVous instanceof RendezVousCalendarUnavailableException) {
    return c.json(movedRendezVous.toDTO(), 503)
  }
  if (movedRendezVous instanceof DatabaseException) {
    return c.json(movedRendezVous, 500)
  }

  return c.json(RendezVousEntity.toDto(movedRendezVous), 200)
})

export default app
