import { OpenAPIHono } from "@hono/zod-openapi"
import { Scalar } from "@scalar/hono-api-reference"
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

import packageJson from "../package.json" with { type: "json" }
import availability from "./core/availability/availability.handler.ts"
import contact from "./core/contact/contact.handler.ts"
import rendezVous from "./core/rendez-vous/rendez-vous.handler.ts"
import database from "./db/db.handler.ts"
import { assertEnv, isProduction } from "./utils/env.ts"
import { reportError, setErrorReporter } from "./utils/report.ts"

// the same path everywhere: inside the Next.js app on Vercel, and on the local Node server
export const API_BASE_PATH = "/api/pourparler"

const HTTP_SERVICE_UNAVAILABLE = 503
const HTTP_INTERNAL_SERVER_ERROR = 500

interface PourparlerAppOptions {
  // where unexpected and handled failures are reported (Sentry in the Next.js app)
  reportError?: (error: unknown, context?: string) => void
}

export function createPourparlerApp(options: PourparlerAppOptions = {}) {
  if (options.reportError) setErrorReporter(options.reportError)

  const app = new OpenAPIHono().basePath(API_BASE_PATH)

  // checked on the first request rather than on import, so the Next.js build never needs the secrets;
  // a deployment without its configuration (a preview, say) answers 503 instead of crashing
  let configured: boolean | undefined
  app.use(async (c, next) => {
    if (configured === undefined) {
      try {
        assertEnv(process.env)
        configured = true
      } catch (error) {
        configured = false
        reportError(error, "Pourparler isn't configured")
      }
    }
    if (!configured) {
      return c.json(
        { message: "Pourparler isn't available here" },
        HTTP_SERVICE_UNAVAILABLE,
      )
    }
    return next()
  })

  if (!isProduction()) app.use(logger())

  // same origin on the site; the list matters only to call the API from elsewhere
  app.use(async (c, next) =>
    cors({
      origin: assertEnv(process.env).CORS_ORIGINS,
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "Upgrade-Insecure-Requests",
      ],
      allowMethods: ["GET", "POST", "PATCH", "DELETE"],
      exposeHeaders: ["Content-Length", "Content-Type"],
    })(c, next),
  )

  // development only: listing every contact, seeding and wiping the database
  if (!isProduction()) {
    app.route("/", contact)
    app.route("/database/", database)
  }
  app.route("/", rendezVous)
  app.route("/", availability)

  app.openAPIRegistry.registerComponent("securitySchemes", "manageToken", {
    type: "http",
    scheme: "bearer",
    description: "The manage token returned when the rendez-vous was created",
  })

  // health check: never echo the configuration (it holds the database and Google secrets)
  app.get("/", (c) => c.json({ status: "ok", version: packageJson.version }))

  const info = { title: "Pourparler API", version: packageJson.version }

  app.doc31("/doc", { openapi: "3.1.0", info })
  app.get("/ui", Scalar({ url: `${API_BASE_PATH}/doc` }))
  app.get("/llms.txt", async (c) =>
    c.text(
      await createMarkdownFromOpenApi(
        JSON.stringify(app.getOpenAPI31Document({ openapi: "3.1.0", info })),
      ),
    ),
  )

  app.onError((error, c) => {
    reportError(error)
    return c.json(
      { message: "Something went wrong on our side" },
      HTTP_INTERNAL_SERVER_ERROR,
    )
  })

  return app
}
