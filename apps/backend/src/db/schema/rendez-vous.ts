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
  ...auditColumns,
})

const rendezVousSelectSchema = createSelectSchema(rendezVous)

export type RendezVousDb = z.infer<typeof rendezVousSelectSchema>
