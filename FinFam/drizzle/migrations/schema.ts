import { pgTable, foreignKey, serial, text, integer, timestamp, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const families = pgTable("families", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	adminId: integer("admin_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.adminId],
			foreignColumns: [users.id],
			name: "families_admin_id_users_id_fk"
		}),
]);

export const budgets = pgTable("budgets", {
	id: serial().primaryKey().notNull(),
	familyId: integer("family_id").notNull(),
	category: text().notNull(),
	value: integer().notNull(),
	date: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.familyId],
			foreignColumns: [families.id],
			name: "budgets_family_id_families_id_fk"
		}),
]);

export const expenses = pgTable("expenses", {
	id: serial().primaryKey().notNull(),
	familyId: integer("family_id").notNull(),
	category: text().notNull(),
	value: integer().notNull(),
	date: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.familyId],
			foreignColumns: [families.id],
			name: "expenses_family_id_families_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	role: text().default('user'),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);
