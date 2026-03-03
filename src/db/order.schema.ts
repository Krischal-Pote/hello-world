import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { packages } from "./package.schema";
import { users } from "./user.schema";

/* =========================
   ORDERS
========================= */

export const orders = sqliteTable(
	"orders",
	{
		id: text("id")
			.primaryKey()
			.notNull()
			.default(sql`(lower(hex(randomblob(32))))`),

		userId: text("user_id")
			.notNull()
			.references(() => users.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),

		packageId: text("package_id")
			.notNull()
			.references(() => packages.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),

		status: text("status").notNull().default("paid"),
		// paid | in_progress | completed
		frequency: text("frequency").notNull().default("one-time"),
		// one-time | daily | weekly | monthly | more
		startDate: integer("start_date", { mode: "timestamp_ms" }),
		endDate: integer("end_date", { mode: "timestamp_ms" }),
		qrToken: text("qr_token").unique(),
		paymentStatus: text("payment_status").default("pending"),
		cyberSourceTransactionId: text("cybersource_transaction_id"),
		cyberSourceReferenceCode: text("cybersource_reference_code"),
		cyberSourceStatus: text("cybersource_status"),
		captureId: text("capture_id"),
		captureStatus: text("capture_status"),
		paymentAmount: text("payment_amount"),
		paymentCurrency: text("payment_currency").default("USD"),
		paymentAuthorizedAt: integer("payment_authorized_at", {
			mode: "timestamp_ms",
		}),
		paymentCapturedAt: integer("payment_captured_at", {
			mode: "timestamp_ms",
		}),
		paymentRawResponse: text("payment_raw_response"),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
		deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
	},
	(t) => [
		index("idx_orders_user").on(t.userId),
		index("idx_orders_qr_token").on(t.qrToken),
		index("idx_orders_cybersource_txn").on(t.cyberSourceTransactionId),
		index("idx_orders_payment_status").on(t.paymentStatus),
	],
);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
