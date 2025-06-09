import { pgTable, varchar } from "drizzle-orm/pg-core"

import { auditColumns } from "../db.columns.js"

export const contact = pgTable("contact", {
  email: varchar({ length: 256 }).primaryKey(),
  ...auditColumns,
})
