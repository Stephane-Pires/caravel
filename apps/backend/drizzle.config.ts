import { defineConfig } from "drizzle-kit"

import { assertEnv } from "./src/utils/env.js"

const env = assertEnv(process.env)

export default defineConfig({
  schema: "./src/db/schema",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: env.POSTGRES_HOST,
    port: Number(env.POSTGRES_PORT),
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
  },
  ssl: false,
  casing: "snake_case",
  migrations: {
    prefix: "unix",
  },
})
