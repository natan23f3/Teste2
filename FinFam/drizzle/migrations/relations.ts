import { relations } from "drizzle-orm/relations";
import { users, families, budgets, expenses } from "./schema";

export const familiesRelations = relations(families, ({one, many}) => ({
	user: one(users, {
		fields: [families.adminId],
		references: [users.id]
	}),
	budgets: many(budgets),
	expenses: many(expenses),
}));

export const usersRelations = relations(users, ({many}) => ({
	families: many(families),
}));

export const budgetsRelations = relations(budgets, ({one}) => ({
	family: one(families, {
		fields: [budgets.familyId],
		references: [families.id]
	}),
}));

export const expensesRelations = relations(expenses, ({one}) => ({
	family: one(families, {
		fields: [expenses.familyId],
		references: [families.id]
	}),
}));