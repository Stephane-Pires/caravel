import { createRoute, z } from "@hono/zod-openapi"

import { API_TAG } from "../utils/tag.js"

export const getSeedRoute = createRoute({
  method: "get",
  path: "seed",
  tags: [API_TAG.DATABASE],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Retrieves contacts informations",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: "Internal server error : Failed to seed database",
    },
  },
})

export const getResetRoute = createRoute({
  method: "get",
  path: "reset",
  tags: [API_TAG.DATABASE],
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
      description: "Database reset successfully",
    },
    500: {
      content: {
        "application/json": {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
      description: "Internal server error : Failed to reset database",
    },
  },
})
