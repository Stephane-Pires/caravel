import { z } from "@hono/zod-openapi"
import pg, { DatabaseError } from "pg"

function createExceptionSchema({
  name,
  code,
  message,
  description,
}: {
  name: string
  code: string
  message: string
  description: string
}) {
  return z
    .object({
      name: z.literal(name),
      code: z.literal(code),
      message: z.literal(message),
    })
    .openapi({
      description,
      example: {
        name,
        code,
        message,
      },
    })
}

export abstract class DomainException extends Error {
  abstract readonly code: string
  abstract readonly description: string

  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = new.target.name
    Object.setPrototypeOf(this, new.target.prototype)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target)
    }
  }

  toDTO() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
    }
  }

  toSchema() {
    return createExceptionSchema({
      name: this.name,
      code: this.code,
      message: this.message,
      description: this.description,
    })
  }
}

export class DatabaseException extends Error {
  override cause?: DatabaseError

  constructor(message: string, options?: { cause?: DatabaseError }) {
    super(message)
    this.name = new.target.name
    Object.setPrototypeOf(this, new.target.prototype)

    if (options?.cause) {
      this.cause = options.cause
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target)
    }
  }
}
