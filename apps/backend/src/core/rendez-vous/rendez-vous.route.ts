import { createRoute } from "@hono/zod-openapi"

import { API_TAG } from "../../utils/tag.js"
import {
  CreateRendezVousPayloadSchema,
  RendezVousDTOSchema,
  RendezVousParamsSchema,
} from "./rendez-vous.entity.js"
import {
  RendezVousInvalidScheduleAtExceptionSchema,
  RendezVousNotFoundExceptionSchema,
} from "./rendez-vous.exception.js"

export const getRendezVousRoute = createRoute({
  method: "get",
  path: "rendez-vous",
  tags: [API_TAG.RENDEZ_VOUS],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: RendezVousDTOSchema.array(),
        },
      },
      description: "Retrieves rendez-vous",
    },
  },
})

export const getRendezVousByIdRoute = createRoute({
  method: "get",
  path: "/rendez-vous/{id}",
  tags: [API_TAG.RENDEZ_VOUS],
  request: {
    params: RendezVousParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: RendezVousDTOSchema,
        },
      },
      description: "Retrieve the rendez-vous by ID",
    },
    400: {
      description: "Invalid request parameters",
    },
    404: {
      description: "Rendez-vous not found",
      content: {
        "application/json": {
          schema: RendezVousNotFoundExceptionSchema,
        },
      },
    },
  },
})

export const postRendezVousRoute = createRoute({
  method: "post",
  path: "/rendez-vous",
  tags: [API_TAG.RENDEZ_VOUS],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateRendezVousPayloadSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: RendezVousDTOSchema,
        },
      },
      description: "Create a new rendez-vous",
    },
    400: {
      description: "Invalid request parameters",
    },
    422: {
      description: "Invalid Semantic Payload",
      content: {
        "application/json": {
          schema: RendezVousInvalidScheduleAtExceptionSchema,
        },
      },
    },
  },
})

//
