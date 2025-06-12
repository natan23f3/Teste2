import { pgTable, serial, text, integer, date } from 'drizzle-orm/pg-core';
import { users } from './User';

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  amount: integer('amount').notNull(),
  date: date('date').notNull(),
  userId: integer('user_id').references(() => users.id),
});