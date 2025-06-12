import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { families } from './Family';

export const budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  familyId: integer('family_id').notNull().references(() => families.id),
  category: text('category').notNull(),
  value: integer('value').notNull(),
  date: timestamp('date').notNull(),
});

export type Budget = typeof budgets.$inferSelect; // return type when queried
export type NewBudget = typeof budgets.$inferInsert; // insert type