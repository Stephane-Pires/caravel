import { z } from "@hono/zod-openapi"

export const RendezVousIdParamExceptionSchema = z
  .object({
    title: z.literal("RendezVousIdParamException"),
    code: z.literal("1001"),
    message: z.literal("Invalid rendez-vous ID"),
  })
  .openapi({
    description: "Exception thrown when the rendez-vous ID is invalid.",
    example: {
      title: "RendezVousIdParamException",
      code: "1001",
      message: "Invalid rendez-vous ID",
    },
  })

export type RendezVousIdParamException = z.infer<
  typeof RendezVousIdParamExceptionSchema
>

export const RendezVousNotFoundExceptionSchema = z
  .object({
    title: z.literal("RendezVousNotFoundException"),
    code: z.literal("1001"),
    message: z.literal("Rendez-vous not found"),
  })
  .openapi({
    description: "Exception thrown when the rendez-vous is not found",
    example: {
      title: "RendezVousNotFoundException",
      code: "1001",
      message: "Rendez-vous not found",
    },
  })

export type RendezVousNotFoundException = z.infer<
  typeof RendezVousNotFoundExceptionSchema
>

export const RendezVousInvalidScheduleAtExceptionSchema = z
  .object({
    title: z.literal("RendezVousInvalidScheduleAtException"),
    code: z.literal("1002"),
    message: z.literal("Rendez-vous scheduled at is invalid"),
  })
  .openapi({
    description:
      "Exception thrown when the rendez-vous is scheduled at an invalid date",
    example: {
      title: "RendezVousInvalidScheduleAtException",
      code: "1002",
      message: "Rendez-vous scheduled at is invalid",
    },
  })

export type RendezVousInvalidScheduleAtException = z.infer<
  typeof RendezVousInvalidScheduleAtExceptionSchema
>
