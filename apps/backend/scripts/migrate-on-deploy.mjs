// Brings the live database up to date during Vercel's production build, before the new code
// serves a single request. Previews and local builds skip it: they must never touch production.
//
//   pnpm --filter backend db:deploy
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { fileURLToPath } from "node:url"

const { VERCEL_ENV, DATABASE_URL_UNPOOLED, DATABASE_URL } = process.env

if (VERCEL_ENV !== "production") {
  console.log(`Migrations skipped (VERCEL_ENV=${VERCEL_ENV ?? "unset"})`)
  process.exit(0)
}

// Neon's direct connection: its pooler is for the app's short queries
const url = DATABASE_URL_UNPOOLED ?? DATABASE_URL
if (!url) {
  console.error("Migrations need DATABASE_URL_UNPOOLED or DATABASE_URL")
  process.exit(1)
}

const db = drizzle({ connection: { connectionString: url, max: 1 } })

await migrate(db, {
  migrationsFolder: fileURLToPath(new URL("../migrations", import.meta.url)),
})
await db.$client.end()
console.log("Database migrated")
