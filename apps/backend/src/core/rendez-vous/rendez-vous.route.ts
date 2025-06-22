import { createRoute } from "@hono/zod-openapi"

import { API_TAG } from "../../utils/tag.js"
import {
  CreateRendezVousPayloadSchema,
  MoveRendezVousPayloadSchema,
  RendezVousDTOSchema,
  RendezVousParamsSchema,
  RendezVousQueryParamSchema,
} from "./rendez-vous.entity.js"
import {
  RendezVousInvalidScheduleAtAlreadyTakenException,
  RendezVousInvalidScheduleAtException,
  RendezVousNotFoundException,
} from "./rendez-vous.exception.js"

export const getRendezVousRoute = createRoute({
  method: "get",
  path: "rendez-vous",
  tags: [API_TAG.RENDEZ_VOUS],
  request: {
    query: RendezVousQueryParamSchema,
  },
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
          schema: new RendezVousNotFoundException().toSchema(),
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
    409: {
      description: "Rendez-vous already exists at the same time",
      content: {
        "application/json": {
          schema:
            new RendezVousInvalidScheduleAtAlreadyTakenException().toSchema(),
        },
      },
    },
    422: {
      description: "Invalid Semantic Payload",
      content: {
        "application/json": {
          schema: new RendezVousInvalidScheduleAtException().toSchema(),
        },
      },
    },
  },
})

export const cancelRendezVousRoute = createRoute({
  method: "delete",
  path: "/rendez-vous/{id}",
  tags: [API_TAG.RENDEZ_VOUS],
  request: {
    params: RendezVousParamsSchema,
  },
  responses: {
    204: {
      description: "Delete rendez-vous",
    },
    400: {
      description: "Invalid request parameters",
    },
    404: {
      description: "Rendez-vous not found",
      content: {
        "application/json": {
          schema: new RendezVousNotFoundException().toSchema(),
        },
      },
    },
  },
})

export const moveRendezVousRoute = createRoute({
  method: "patch",
  path: "/rendez-vous/{id}/move",
  tags: [API_TAG.RENDEZ_VOUS],
  request: {
    params: RendezVousParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: MoveRendezVousPayloadSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Moved rendez-vous",
      content: {
        "application/json": {
          schema: RendezVousDTOSchema,
        },
      },
    },
    400: {
      description: "Invalid request parameters",
    },
    404: {
      description: "Rendez-vous not found",
      content: {
        "application/json": {
          schema: new RendezVousNotFoundException().toSchema(),
        },
      },
    },
    422: {
      description: "Invalid Semantic Payload",
      content: {
        "application/json": {
          schema: new RendezVousInvalidScheduleAtException().toSchema(),
        },
      },
    },
  },
})
