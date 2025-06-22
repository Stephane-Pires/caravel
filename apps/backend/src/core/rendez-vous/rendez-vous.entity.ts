import { z } from "@hono/zod-openapi"
import dayjs from "dayjs"

import type { RendezVousDb } from "../../db/schema/rendez-vous.js"
import { ContactSchema } from "../contact/contact.entity.js"
import {
  RendezVousInvalidScheduleAtAlreadyTakenException,
  RendezVousInvalidScheduleAtException,
} from "./rendez-vous.exception.js"
import { getRendezVousService } from "./rendez-vous.service.js"

const RendezVousSchema = z.object({
  id: z.number().min(1).openapi({
    example: 1,
  }),
  contactEmail: ContactSchema.shape.email,
  scheduledAt: z.date(),
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

export const RendezVousDTOSchema = RendezVousSchema.extend({
  id: RendezVousSchema.shape.id.openapi({
    example: 1,
  }),
  contactEmail: ContactSchema.shape.email.openapi({
    example: "john.doe@gmail.com",
  }),
  scheduledAt: z.date().openapi({
    example: "2023-10-01T10:00:00Z",
  }),
}).openapi("RendezVousDTO")

type RendezVousDTO = z.infer<typeof RendezVousDTOSchema>

export const CreateRendezVousPayloadSchema = z
  .object({
    contactEmail: ContactSchema.shape.email.openapi({
      example: "john.doe@gmail.com",
    }),
    scheduledAt: z.coerce.string().datetime().pipe(z.coerce.date()).openapi({
      example: "2023-10-01T10:00:00Z",
    }),
  })
  .openapi("CreateRendezVousPayload", {
    description: "Payload for creating a new rendez-vous",
    required: ["contactEmail", "scheduledAt"],
    example: {
      contactEmail: "john.doe@gmail.com",
      scheduledAt: "2023-10-01T10:00:00Z",
    },
  })

export type CreateRendezVousPayload = z.infer<
  typeof CreateRendezVousPayloadSchema
>

export const UpdateRendezVousSchema = z
  .object({
    scheduledAt: z.coerce.string().datetime().pipe(z.coerce.date()).openapi({
      example: "2024-10-01T10:00:00Z",
    }),
  })
  .partial()

export type UpdateRendezVous = z.infer<typeof UpdateRendezVousSchema>

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

  static async checkInvariants(
    rendezVous: Partial<RendezVous>,
  ): InvariantResult {
    if (
      rendezVous.scheduledAt &&
      dayjs(rendezVous.scheduledAt).isBefore(dayjs())
    ) {
      return {
        success: false,
        exception: new RendezVousInvalidScheduleAtException(),
      }
    }

    if (rendezVous.scheduledAt) {
      const scheduledAt = dayjs(rendezVous.scheduledAt)

      const rendezVousSaved = await getRendezVousService({
        filter: {
          dateRange: {
            start: scheduledAt.subtract(30, "minute").toDate(),
            end: scheduledAt.add(30, "minute").toDate(),
          },
        },
      })

      if (rendezVousSaved.length > 0) {
        return {
          success: false,
          exception: new RendezVousInvalidScheduleAtAlreadyTakenException(),
        }
      }
    }

    return {
      success: true,
    }
  }
}
