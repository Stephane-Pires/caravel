import { OpenAPIHono } from "@hono/zod-openapi"
import { reset } from "drizzle-seed"

import { getDbClient } from "./db.client.ts"
import { getResetRoute, getSeedRoute } from "./db.route.ts"
import { dbSchema } from "./db.schema.ts"
import { seedDb } from "./db.seed.ts"

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
