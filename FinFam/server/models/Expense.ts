import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { families } from './Family';

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  familyId: integer('family_id').notNull().references(() => families.id),
  category: text('category').notNull(),
  value: integer('value').notNull(),
  date: timestamp('date').notNull(),
});

export type Expense = typeof expenses.$inferSelect; // return type when queried
export type NewExpense = typeof expenses.$inferInsert; // insert type