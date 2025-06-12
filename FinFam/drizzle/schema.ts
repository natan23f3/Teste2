import { pgTable, serial, text, timestamp, integer, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const families = pgTable('families', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  adminId: integer('admin_id').notNull().references(() => users.id),
});

export const budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  familyId: integer('family_id').notNull().references(() => families.id),
  category: text('category').notNull(),
  value: integer('value').notNull(),
  date: timestamp('date').notNull(),
});

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  familyId: integer('family_id').notNull().references(() => families.id),
  category: text('category').notNull(),
  value: integer('value').notNull(),
  date: timestamp('date').notNull(),
});