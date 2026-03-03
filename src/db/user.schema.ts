import { sql } from "drizzle-orm";
import {
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";

/* =========================
   USERS
========================= */
export const users = sqliteTable(
	"users",
	{
		id: text("id")
			.primaryKey()
			.notNull()
			.default(sql`(lower(hex(randomblob(32))))`),
		fullName: text("full_name"),
		email: text("email").unique(),
		emailVerified: integer("email_verified").default(0), // required by Better Auth
		avatarUrl: text("avatar_url"),
		phone: text("phone"),
		role: text("role").default("user"), // admin | staff | user
		status: text("status").default("active"), // active | inactive | blocked
		createdAt: integer("created_at", { mode: "timestamp_ms" }).default(
			sql`(unixepoch())`,
		),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" }).default(
			sql`(unixepoch())`,
		),
		deletedAt: integer("deleted_at"),
	},
	(t) => [
		index("idx_users_role").on(t.role),
		uniqueIndex("uidx_email").on(t.email),
	],
);
