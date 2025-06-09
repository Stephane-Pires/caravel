import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core"

import { auditColumns } from "../db.columns.js"
import { contact } from "./contact.js"

export const rendezVous = pgTable("rendez_vous", {
  id: serial().primaryKey(),
  contactEmail: varchar().references(() => contact.email, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  scheduledAt: timestamp().notNull().unique(),
  ...auditColumns,
})
