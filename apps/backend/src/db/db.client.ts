import { drizzle } from "drizzle-orm/node-postgres"

const db = await drizzle({
  connection: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  logger: true,
  casing: "snake_case",
})

// Should create a class probably :thinking: with a singleton pattern
export function getDbClient() {
  if (!db) {
    throw new Error("Database not initialized")
  }
  return db
}
