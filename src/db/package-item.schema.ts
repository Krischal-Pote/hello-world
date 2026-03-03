import { relations, sql } from "drizzle-orm";
import {
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { items } from "./item.schema";
import { packages } from "./package.schema";

/* =========================
   PACKAGE ITEMS
========================= */
export const packageItems = sqliteTable(
	"package_items",
	{
		id: text("id")
			.primaryKey()
			.notNull()
			.default(sql`(lower(hex(randomblob(32))))`),
		itemId: text("item_id").references(() => items.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
		packageId: text("package_id").references(() => packages.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
		quantity: integer("item_quantity").default(0),
		createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
			sql`(unixepoch())`,
		),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" }).default(
			sql`(unixepoch())`,
		),
		deletedAt: integer("deleted_at"),
	},
	(t) => [
		index("idx_package_items_item").on(t.itemId),
		index("idx_package_items_package").on(t.packageId),
		uniqueIndex("uidx_package_items").on(t.itemId, t.packageId),
	],
);

export const packageItemsRelations = relations(packageItems, ({ one }) => ({
	package: one(packages, {
		fields: [packageItems.packageId],
		references: [packages.id],
	}),
	item: one(items, {
		fields: [packageItems.itemId],
		references: [items.id],
	}),
}));
