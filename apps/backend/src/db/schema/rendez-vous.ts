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
  // instants (timestamptz): shown in each visitor's own zone
  scheduledAt: timestamp({ withTimezone: true }).notNull().unique(),
  // the booked range is [scheduledAt, endsAt); an exclusion constraint forbids overlapping ranges
  endsAt: timestamp({ withTimezone: true }).notNull(),
  guestName: varchar({ length: 120 }),
  topic: varchar({ length: 500 }),
  // the event in the captain's Google Calendar (invitation, Meet link, reminders)
  calendarEventId: varchar({ length: 256 }),
  meetLink: varchar({ length: 256 }),
  // SHA-256 of the secret token that lets the guest manage this rendez-vous (utils/token.ts)
  manageTokenHash: varchar({ length: 64 }),
  ...auditColumns,
})

const rendezVousSelectSchema = createSelectSchema(rendezVous)

export type RendezVousDb = z.infer<typeof rendezVousSelectSchema>
