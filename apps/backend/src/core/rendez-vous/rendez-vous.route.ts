import { createRoute } from "@hono/zod-openapi"

import { API_TAG } from "../../utils/tag.js"
import {
  BusySlotDTOSchema,
  CreateRendezVousPayloadSchema,
  CreatedRendezVousDTOSchema,
  ManageTokenHeadersSchema,
  MoveRendezVousPayloadSchema,
  RendezVousDTOSchema,
  RendezVousParamsSchema,
  RendezVousQueryParamSchema,
} from "./rendez-vous.entity.js"
import {
  RendezVousCalendarUnavailableException,
  RendezVousInvalidScheduleAtAlreadyTakenException,
  RendezVousInvalidScheduleAtException,
  RendezVousNotFoundException,
  RendezVousSpamCheckFailedException,
  RendezVousTooManyException,
} from "./rendez-vous.exception.js"

// seeing, moving or cancelling a rendez-vous needs the token given at creation
const manageTokenSecurity = [{ manageToken: [] }]

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
          schema: BusySlotDTOSchema.array(),
        },
      },
      description: "When the captain is already busy (times only, no guests)",
    },
  },
})

export const getRendezVousByIdRoute = createRoute({
  method: "get",
  path: "/rendez-vous/{id}",
  tags: [API_TAG.RENDEZ_VOUS],
  security: manageTokenSecurity,
  request: {
    params: RendezVousParamsSchema,
    headers: ManageTokenHeadersSchema,
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
          schema: CreatedRendezVousDTOSchema,
        },
      },
      description:
        "Create a new rendez-vous (the response carries its manage token, once)",
    },
    403: {
      description: "The anti-spam check failed",
      content: {
        "application/json": {
          schema: new RendezVousSpamCheckFailedException().toSchema(),
        },
      },
    },
    429: {
      description: "Too many upcoming rendez-vous for this email",
      content: {
        "application/json": {
          schema: new RendezVousTooManyException().toSchema(),
        },
      },
    },
    503: {
      description:
        "The captain's calendar couldn't be reached; nothing was changed",
      content: {
        "application/json": {
          schema: new RendezVousCalendarUnavailableException().toSchema(),
        },
      },
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
  security: manageTokenSecurity,
  request: {
    params: RendezVousParamsSchema,
    headers: ManageTokenHeadersSchema,
  },
  responses: {
    204: {
      description: "Delete rendez-vous",
    },
    503: {
      description:
        "The captain's calendar couldn't be reached; nothing was changed",
      content: {
        "application/json": {
          schema: new RendezVousCalendarUnavailableException().toSchema(),
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
  },
})

export const moveRendezVousRoute = createRoute({
  method: "patch",
  path: "/rendez-vous/{id}/move",
  tags: [API_TAG.RENDEZ_VOUS],
  security: manageTokenSecurity,
  request: {
    params: RendezVousParamsSchema,
    headers: ManageTokenHeadersSchema,
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
    503: {
      description:
        "The captain's calendar couldn't be reached; nothing was changed",
      content: {
        "application/json": {
          schema: new RendezVousCalendarUnavailableException().toSchema(),
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
