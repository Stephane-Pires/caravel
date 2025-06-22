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
import { assertEnv } from "./utils/env.js"

dotenv.config()

const app = new OpenAPIHono()

app.use(logger())
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "Upgrade-Insecure-Requests",
    ],
    allowMethods: ["GET", "POST", "DELETE"],
    exposeHeaders: ["Content-Length", "Content-Type"],
  }),
)

app.route("/", contact)
app.route("/database/", database)
app.route("/", rendezVous)

app.get("/", (c) => {
  return c.json(assertEnv(process.env))
})

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
