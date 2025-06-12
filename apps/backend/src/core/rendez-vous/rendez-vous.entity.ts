import { z } from "@hono/zod-openapi"
import dayjs from "dayjs"

import type { RendezVousDb } from "../../db/schema/rendez-vous.js"
import { ContactSchema } from "../contact/contact.entity.js"
import { RendezVousInvalidScheduleAtException } from "./rendez-vous.exception.js"

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
  exception: RendezVousInvalidScheduleAtException
}

type InvariantResult = InvariantSuccess | InvariantError

export class RendezVousEntity {
  constructor() {}

  static fromRepository(data: RendezVousDb): RendezVous {
    return RendezVousSchema.parse(data)
  }

  static toDto(rendezVous: RendezVous): RendezVousDTO {
    return RendezVousDTOSchema.parse(rendezVous)
  }

  static checkInvariants(rendezVous: Partial<RendezVous>): InvariantResult {
    if (
      rendezVous.scheduledAt &&
      dayjs(rendezVous.scheduledAt).isBefore(dayjs())
    ) {
      return {
        success: false,
        exception: new RendezVousInvalidScheduleAtException(),
      }
    }

    return {
      success: true,
    }
  }
}
