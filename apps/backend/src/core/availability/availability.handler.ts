import { OpenAPIHono } from "@hono/zod-openapi"

import { AVAILABILITY } from "./availability.config.ts"
import { getSlotsRoute } from "./availability.route.ts"
import { getFreeSlotsService } from "./availability.service.ts"

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
