import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { users } from './User';

export const families = pgTable('families', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  adminId: integer('admin_id').notNull().references(() => users.id),
});

export type Family = typeof families.$inferSelect; // return type when queried
export type NewFamily = typeof families.$inferInsert; // insert type