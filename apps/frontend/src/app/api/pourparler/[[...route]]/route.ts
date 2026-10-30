import * as Sentry from "@sentry/nextjs"
import { createPourparlerApp } from "backend/src/app"

// The Pourparler API (Hono) answers every /api/pourparler/* request, on the site's own origin
const app = createPourparlerApp({
  reportError: (error, context) =>
    Sentry.captureException(error, context ? { extra: { context } } : {}),
})

// node-postgres needs Node.js, not the edge runtime
export const runtime = "nodejs"

const handle = (request: Request) => app.fetch(request)

export const GET = handle
export const POST = handle
export const PATCH = handle
export const DELETE = handle
export const OPTIONS = handle
