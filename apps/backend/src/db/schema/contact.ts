import { pgTable, varchar } from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod/v4"

import { auditColumns } from "../db.columns.js"

export const contact = pgTable("contact", {
  email: varchar({ length: 256 }).primaryKey(),
  ...auditColumns,
})

const contactSelectSchema = createSelectSchema(contact)

export type ContactDb = z.infer<typeof contactSelectSchema>
