import { serve } from "@hono/node-server"
import { OpenAPIHono } from "@hono/zod-openapi"
import { Scalar } from "@scalar/hono-api-reference"
import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown"
import dotenv from "dotenv"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

import packageJson from "../package.json" with { type: "json" }
import contact from "./core/contact/contact.handler.js"
import rendezVous from "./core/rendez-vous/rendez-vous.handler.js"
import database from "./db/db.handler.js"
import { assertEnv, isProduction } from "./utils/env.js"

dotenv.config()

const env = assertEnv(process.env) // fail fast on a bad configuration, at startup

const app = new OpenAPIHono()

app.use(logger())
app.use(
  "*",
  cors({
    origin: env.CORS_ORIGINS,
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "Upgrade-Insecure-Requests",
    ],
    allowMethods: ["GET", "POST", "PATCH", "DELETE"],
    exposeHeaders: ["Content-Length", "Content-Type"],
  }),
)

// development only: listing every contact, seeding and wiping the database
if (!isProduction()) {
  app.route("/", contact)
  app.route("/database/", database)
}
app.route("/", rendezVous)

app.openAPIRegistry.registerComponent("securitySchemes", "manageToken", {
  type: "http",
  scheme: "bearer",
  description: "The manage token returned when the rendez-vous was created",
})

// health check: never echo the configuration (it holds the database and mail passwords)
app.get("/", (c) => c.json({ status: "ok", version: packageJson.version }))

app.doc31("/doc", {
  openapi: "3.1.0",
  info: {
    title: "Caravel API",
    version: packageJson.version,
  },
})

const openapiDoc = app.getOpenAPI31Document({
  openapi: "3.1.0",
  info: { title: "Example", version: "v1" },
})

app.get("/ui", Scalar({ url: "/doc" }))

app.get("/llms.txt", async (c) => {
  return c.text(await createMarkdownFromOpenApi(JSON.stringify(openapiDoc)))
})

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
