import { z } from "@hono/zod-openapi"
import dayjs from "dayjs"

import type { RendezVousDb } from "../../db/schema/rendez-vous.ts"
import { ContactSchema } from "../contact/contact.entity.ts"
import {
  isOfferedSlotStart,
  slotEnd,
} from "../availability/availability.service.ts"
import {
  RendezVousInvalidScheduleAtAlreadyTakenException,
  RendezVousInvalidScheduleAtException,
  RendezVousCalendarUnavailableException,
  RendezVousOutsideAvailabilityException,
} from "./rendez-vous.exception.ts"
import {
  CalendarUnavailableError,
  getCalendar,
} from "../../utils/google-calendar.ts"
import { reportError } from "../../utils/report.ts"
import { getOverlappingRendezVousRepository } from "./rendez-vous.repository.ts"

const RendezVousSchema = z.object({
  id: z.number().min(1).openapi({
    example: 1,
  }),
  contactEmail: ContactSchema.shape.email,
  scheduledAt: z.date(),
  endsAt: z.date(),
  guestName: z.string().nullable(),
  topic: z.string().nullable(),
  calendarEventId: z.string().nullable(),
  meetLink: z.string().nullable(),
})

export type RendezVous = z.infer<typeof RendezVousSchema>

export const RendezVousParamsSchema = z
  .object({
    id: z.coerce.number().min(1).openapi({
      example: 1,
    }),
  })
  .openapi("RendezVousParams")

export const RendezVousQueryParamSchema = z
  .object({
    "dateRange[start]": z.coerce
      .date()
      .optional()
      .openapi({ example: "2025-10-01T00:00:00Z" }),
    "dateRange[end]": z.coerce
      .date()
      .optional()
      .openapi({ example: "2026-10-31T23:59:59Z" }),
  })
  .refine(
    (data) => {
      const startDefined = data["dateRange[start]"] !== undefined
      const endDefined = data["dateRange[end]"] !== undefined
      return (startDefined && endDefined) || (!startDefined && !endDefined)
    },
    {
      message:
        "Both dateRange[start] and dateRange[end] must be provided together.",
      path: ["dateRange"],
    },
  )
  .refine(
    (data) => {
      const start = data["dateRange[start]"]
      const end = data["dateRange[end]"]
      if (start && end) {
        return dayjs(start).isBefore(end) || dayjs(start).isSame(end)
      }
      return true
    },
    {
      message: "dateRange[start] must be before or equal to dateRange[end].",
      path: ["dateRange[start]"],
    },
  )
  .openapi("RendezVousQueryParamSchema")

export const RendezVousDTOSchema = RendezVousSchema.omit({
  calendarEventId: true, // internal: the link to the captain's calendar
})
  .extend({
    id: RendezVousSchema.shape.id.openapi({
      example: 1,
    }),
    contactEmail: ContactSchema.shape.email.openapi({
      example: "john.doe@gmail.com",
    }),
    scheduledAt: z.date().openapi({
      example: "2023-10-01T10:00:00Z",
    }),
    endsAt: z.date().openapi({
      example: "2023-10-01T10:30:00Z",
    }),
    guestName: z.string().nullable().openapi({ example: "Jack Sparrow" }),
    topic: z.string().nullable().openapi({ example: "A role on your team" }),
    meetLink: z
      .string()
      .nullable()
      .openapi({ example: "https://meet.google.com/abc-defg-hij" }),
  })
  .openapi("RendezVousDTO")

type RendezVousDTO = z.infer<typeof RendezVousDTOSchema>

// what anyone may see: when the captain is busy, never who with
export const BusySlotDTOSchema = z
  .object({
    scheduledAt: z.date().openapi({ example: "2026-10-01T10:00:00Z" }),
  })
  .openapi("BusySlotDTO")

// returned once, on creation: the secret to see, move or cancel this rendez-vous later
export const CreatedRendezVousDTOSchema = RendezVousDTOSchema.extend({
  manageToken: z.string().openapi({
    description:
      "Secret to send as `Authorization: Bearer <token>` to see, move or cancel this rendez-vous. Shown only once.",
    example: "q9Z0mJ8r2Xh7c1pY4fK6vT3sWbN5aL0dGeUiOoRtE2M",
  }),
}).openapi("CreatedRendezVousDTO")

export const ManageTokenHeadersSchema = z.object({
  authorization: z.string().openapi({
    description: "Bearer token received when the rendez-vous was created",
    example: "Bearer q9Z0mJ8r2Xh7c1pY4fK6vT3sWbN5aL0dGeUiOoRtE2M",
  }),
})

export const CreateRendezVousPayloadSchema = z
  .object({
    contactEmail: ContactSchema.shape.email.openapi({
      example: "john.doe@gmail.com",
    }),
    scheduledAt: z.iso.datetime().pipe(z.coerce.date()).openapi({
      example: "2023-10-01T10:00:00Z",
    }),
    guestName: z.string().trim().min(1).max(120).openapi({
      example: "Jack Sparrow",
    }),
    topic: z.string().trim().max(500).optional().openapi({
      example: "A role on your team",
    }),
  })
  .openapi("CreateRendezVousPayload", {
    description: "Payload for creating a new rendez-vous",
    required: ["contactEmail", "scheduledAt"],
    example: {
      contactEmail: "john.doe@gmail.com",
      scheduledAt: "2023-10-01T10:00:00Z",
      guestName: "John Doe",
      topic: "A role on your team",
    },
  })

export type CreateRendezVousPayload = z.infer<
  typeof CreateRendezVousPayloadSchema
>

export const UpdateRendezVousSchema = z
  .object({
    scheduledAt: z.iso.datetime().pipe(z.coerce.date()).openapi({
      example: "2024-10-01T10:00:00Z",
    }),
  })
  .partial()

export type UpdateRendezVous = z.infer<typeof UpdateRendezVousSchema> & {
  endsAt?: Date
  calendarEventId?: string | null
  meetLink?: string | null
}

export const MoveRendezVousPayloadSchema = z
  .object({
    scheduledAt: UpdateRendezVousSchema.shape.scheduledAt.openapi({
      example: "2026-10-01T10:00:00Z",
    }),
  })
  .openapi("MoveRendezVousPayload", {
    description: "Moving the rendez-vous to a new date",
    required: ["scheduledAt"],
    example: {
      scheduledAt: "2026-10-01T10:00:00Z",
    },
  })
  .strict()

export type MoveRendezVousPayload = z.infer<typeof MoveRendezVousPayloadSchema>

interface InvariantSuccess {
  success: true
}

interface InvariantError {
  success: false
  exception:
    | RendezVousInvalidScheduleAtException
    | RendezVousInvalidScheduleAtAlreadyTakenException
    | RendezVousOutsideAvailabilityException
    | RendezVousCalendarUnavailableException
}

type InvariantResult = Promise<InvariantSuccess | InvariantError>

export class RendezVousEntity {
  constructor() {}

  static fromRepository(data: RendezVousDb): RendezVous {
    return RendezVousSchema.parse(data)
  }

  static toDto(rendezVous: RendezVous): RendezVousDTO {
    return RendezVousDTOSchema.parse(rendezVous)
  }

  static toBusySlotDto(rendezVous: RendezVous) {
    return BusySlotDTOSchema.parse({ scheduledAt: rendezVous.scheduledAt })
  }

  // a rendez-vous must start on an offered slot that nobody else holds
  // (the database's exclusion constraint is the final word when two guests book at once)
  static async checkInvariants(
    rendezVous: Partial<RendezVous>,
  ): InvariantResult {
    if (!rendezVous.scheduledAt) return { success: true }

    if (dayjs(rendezVous.scheduledAt).isBefore(dayjs())) {
      return {
        success: false,
        exception: new RendezVousInvalidScheduleAtException(),
      }
    }

    if (!isOfferedSlotStart(rendezVous.scheduledAt)) {
      return {
        success: false,
        exception: new RendezVousOutsideAvailabilityException(),
      }
    }

    const taken = await getOverlappingRendezVousRepository(
      rendezVous.scheduledAt,
      slotEnd(rendezVous.scheduledAt),
      rendezVous.id,
    )

    if (taken.length > 0) {
      return {
        success: false,
        exception: new RendezVousInvalidScheduleAtAlreadyTakenException(),
      }
    }

    // the captain may be busy elsewhere in his calendar (a moving rendez-vous ignores its own event)
    try {
      const busy = await getCalendar().busyRanges(
        rendezVous.scheduledAt,
        slotEnd(rendezVous.scheduledAt),
        rendezVous.calendarEventId ? [rendezVous.calendarEventId] : [],
      )
      if (busy.length > 0) {
        return {
          success: false,
          exception: new RendezVousInvalidScheduleAtAlreadyTakenException(),
        }
      }
    } catch (error) {
      if (!(error instanceof CalendarUnavailableError)) throw error
      reportError(error)
      return {
        success: false,
        exception: new RendezVousCalendarUnavailableException(),
      }
    }

    return {
      success: true,
    }
  }
}
