import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { users } from './User';

export const budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  amount: integer('amount').notNull(),
  userId: integer('user_id').references(() => users.id),
});