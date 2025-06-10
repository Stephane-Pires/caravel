import { serve } from "@hono/node-server"
import { OpenAPIHono } from "@hono/zod-openapi"
import { Scalar } from "@scalar/hono-api-reference"
import dotenv from "dotenv"
import { logger } from "hono/logger"

import packageJson from "../package.json" with { type: "json" }
import contact from "./core/contact/contact.handler.js"
import rendezVous from "./core/rendez-vous/rendez-vous.handler.js"
import database from "./db/db.handler.js"
import { assertEnv } from "./utils/env.js"

dotenv.config()

const app = new OpenAPIHono()

app.use(logger())

app.route("/", contact)
app.route("/database/", database)
app.route("/", rendezVous)

app.get("/", (c) => {
  return c.json(assertEnv(process.env))
})

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    title: "Caravel API",
    version: packageJson.version,
  },
})

app.get("/ui", Scalar({ url: "/doc" }))

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
