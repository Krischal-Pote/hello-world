import { relations, sql } from "drizzle-orm";
import { integer, numeric, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { packageItems } from "./package-item.schema";
import { users } from "./user.schema";

/* =========================
   PACKAGES
========================= */
export const packages = sqliteTable("packages", {
	id: text("id")
		.primaryKey()
		.notNull()
		.default(sql`(lower(hex(randomblob(32))))`),
	title: text("title"),
	image: text("image"),
	slug: text("slug"),
	description: text("description"),
	price: numeric("price"),
	currency: text("currency").default("NPR"),
	isActive: integer("is_active").default(1),
	createdBy: text("created_by").references(() => users.id, {
		onDelete: "cascade",
		onUpdate: "cascade",
	}),
	createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
		sql`(unixepoch())`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" }).default(
		sql`(unixepoch())`,
	),
	deletedAt: integer("deleted_at"),
});

export const packagesRelations = relations(packages, ({ one, many }) => ({
	packageItems: many(packageItems),
	creator: one(users, {
		fields: [packages.createdBy],
		references: [users.id],
	}),
}));


export type PackageInsert = typeof packages.$inferInsert;
export type PackageSelect = typeof packages.$inferSelect;