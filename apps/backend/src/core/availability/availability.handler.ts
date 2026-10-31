import { OpenAPIHono } from "@hono/zod-openapi"

import { AVAILABILITY } from "./availability.config.js"
import { getSlotsRoute } from "./availability.route.js"
import { getFreeSlotsService } from "./availability.service.js"

const app = new OpenAPIHono()

app.openapi(getSlotsRoute, async (c) => {
  const { from, to } = c.req.valid("query")
  const slots = await getFreeSlotsService({ from, to })
  return c.json(
    {
      timeZone: AVAILABILITY.timeZone,
      slotMinutes: AVAILABILITY.slotMinutes,
      slots,
    },
    200,
  )
})

export default app
