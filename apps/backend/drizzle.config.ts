import { defineConfig } from "drizzle-kit"

import { assertEnv } from "./src/utils/env.ts"

const env = assertEnv(process.env)

// migrations take Neon's direct connection when there is one: its pooler is for the app's short queries
const url =
  process.env.DATABASE_URL_UNPOOLED ??
  env.DATABASE_URL ??
  `postgres://${encodeURIComponent(env.POSTGRES_USER ?? "")}:${encodeURIComponent(env.POSTGRES_PASSWORD ?? "")}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`

export default defineConfig({
  schema: "./src/db/schema",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: { url },
  casing: "snake_case",
  migrations: {
    prefix: "unix",
  },
})
