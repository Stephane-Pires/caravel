import { drizzle } from "drizzle-orm/node-postgres"

import { assertEnv, isProduction } from "../utils/env.ts"

// opened on the first query, not on import: the Next.js build loads this module without a database
let db: ReturnType<typeof connect> | undefined

function connect() {
  const env = assertEnv(process.env)
  return drizzle({
    connection: env.DATABASE_URL
      ? {
          connectionString: env.DATABASE_URL,
          // a serverless instance serves a few requests at once; Neon's pooler holds the rest
          max: 5,
          idleTimeoutMillis: 10_000,
        }
      : {
          host: env.POSTGRES_HOST,
          port: env.POSTGRES_PORT,
          user: env.POSTGRES_USER,
          password: env.POSTGRES_PASSWORD,
          database: env.POSTGRES_DB,
        },
    logger: !isProduction(), // queries carry guests' emails: never log them in production
    casing: "snake_case",
  })
}

export function getDbClient() {
  db ??= connect()
  return db
}
