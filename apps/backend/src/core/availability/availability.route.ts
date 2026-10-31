import { createRoute, z } from "@hono/zod-openapi"

import { API_TAG } from "../../utils/tag.ts"
import { AVAILABILITY } from "./availability.config.ts"

export const SlotDTOSchema = z
  .object({
    start: z.date().openapi({ example: "2026-11-02T09:00:00.000Z" }),
    end: z.date().openapi({ example: "2026-11-02T09:30:00.000Z" }),
  })
  .openapi("SlotDTO")

export const SlotsQuerySchema = z
  .object({
    from: z.iso
      .datetime()
      .pipe(z.coerce.date())
      .optional()
      .openapi({ example: "2026-11-02T00:00:00Z" }),
    to: z.iso
      .datetime()
      .pipe(z.coerce.date())
      .optional()
      .openapi({ example: "2026-11-09T00:00:00Z" }),
  })
  .openapi("SlotsQuery")

export const getSlotsRoute = createRoute({
  method: "get",
  path: "/slots",
  tags: [API_TAG.RENDEZ_VOUS],
  description: `Free slots of ${AVAILABILITY.slotMinutes} minutes, ${AVAILABILITY.start}–${AVAILABILITY.end} ${AVAILABILITY.timeZone}, from ${AVAILABILITY.minNoticeHours} h to ${AVAILABILITY.horizonDays} days ahead. \`from\`/\`to\` narrow the range.`,
  request: { query: SlotsQuerySchema },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            timeZone: z.string().openapi({ example: AVAILABILITY.timeZone }),
            slotMinutes: z
              .number()
              .openapi({ example: AVAILABILITY.slotMinutes }),
            slots: SlotDTOSchema.array(),
          }),
        },
      },
      description: "The free slots, earliest first",
    },
  },
})
