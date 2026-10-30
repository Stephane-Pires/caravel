import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"
import type { z } from "zod/v4"

import { auditColumns } from "../db.columns.js"
import { contact } from "./contact.js"

export const rendezVous = pgTable("rendez_vous", {
  id: serial().primaryKey(),
  contactEmail: varchar()
    .references(() => contact.email, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  scheduledAt: timestamp().notNull().unique(),
  // SHA-256 of the secret token that lets the guest manage this rendez-vous (utils/token.ts)
  manageTokenHash: varchar({ length: 64 }),
  ...auditColumns,
})

const rendezVousSelectSchema = createSelectSchema(rendezVous)

export type RendezVousDb = z.infer<typeof rendezVousSelectSchema>
