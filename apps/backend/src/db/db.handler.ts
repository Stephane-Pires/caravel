import { OpenAPIHono } from "@hono/zod-openapi"
import { reset } from "drizzle-seed"

import { getDbClient } from "./db.client.js"
import { getResetRoute, getSeedRoute } from "./db.route.js"
import { dbSchema } from "./db.schema.js"
import { seedDb } from "./db.seed.js"

const app = new OpenAPIHono()

app.openapi(getSeedRoute, async (c) => {
  try {
    await seedDb()
    return c.json({ message: "Database seeded successfully" }, 200)
  } catch (error) {
    console.error("Error seeding database:", error)
    return c.json({ error: "Failed to seed database" }, 500)
  }
})

app.openapi(getResetRoute, async (c) => {
  try {
    await reset(getDbClient(), dbSchema)
    return c.json({ message: "Database reset successfully" }, 200)
  } catch (error) {
    console.error("Error resetting database:", error)
    return c.json({ error: "Failed to reset database" }, 500)
  }
})

export default app
