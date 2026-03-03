import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/* =========================
   PACKAGE ITEMS
========================= */
export const items = sqliteTable("items", {
	id: text("id")
		.primaryKey()
		.notNull()
		.default(sql`(lower(hex(randomblob(32))))`),
	title: text("title"),
	description: text("description"),
	sku: text("sku").unique(),
	stock: integer("stock").default(0),
	price: integer("price").default(0),
	currency: text("currency").default("NPR"),
	image: text("image"),
	createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
		sql`(unixepoch())`,
	),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" }).default(
		sql`(unixepoch())`,
	),
	deletedAt: integer("deleted_at"),
});
export type ItemSelect = typeof items.$inferSelect;
export type ItemInsert = typeof items.$inferInsert;
