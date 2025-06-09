import { serve } from "@hono/node-server"
import dotenv from "dotenv"
import { reset } from "drizzle-seed"
import { Hono } from "hono"

import { getDbClient } from "./db/db.client.js"
import { dbSchema } from "./db/db.schema.js"
import { seedDb } from "./db/db.seed.js"
import { assertEnv } from "./utils/env.js"

const app = new Hono()

dotenv.config()

app.get("/", (c) => {
  return c.json(assertEnv(process.env))
})

app.get("/database/seed", async (c) => {
  try {
    await seedDb()
    return c.json({ message: "Database seeded successfully" })
  } catch (error) {
    // handle the case where is database has already been seeded and unique constraint conflict reject the query
    console.error("Error seeding database:", error)
    return c.json({ error: "Failed to seed database" }, 500)
  }
})

app.get("/database/reset", async (c) => {
  try {
    await reset(getDbClient(), dbSchema)
    return c.json({ message: "Database reset successfully" })
  } catch (error) {
    console.error("Error resetting database:", error)
    return c.json({ error: "Failed to reset database" })
  }
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
