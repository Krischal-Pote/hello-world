CREATE TABLE `items` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(32)))) NOT NULL,
	`title` text,
	`description` text,
	`sku` text,
	`stock` integer DEFAULT 0,
	`price` integer DEFAULT 0,
	`currency` text DEFAULT 'NPR',
	`image` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	`deleted_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `items_sku_unique` ON `items` (`sku`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(32)))) NOT NULL,
	`user_id` text NOT NULL,
	`package_id` text NOT NULL,
	`status` text DEFAULT 'paid' NOT NULL,
	`frequency` text DEFAULT 'one-time' NOT NULL,
	`start_date` integer,
	`end_date` integer,
	`qr_token` text,
	`payment_status` text DEFAULT 'pending',
	`cybersource_transaction_id` text,
	`cybersource_reference_code` text,
	`cybersource_status` text,
	`capture_id` text,
	`capture_status` text,
	`payment_amount` text,
	`payment_currency` text DEFAULT 'USD',
	`payment_authorized_at` integer,
	`payment_captured_at` integer,
	`payment_raw_response` text,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_qr_token_unique` ON `orders` (`qr_token`);--> statement-breakpoint
CREATE INDEX `idx_orders_user` ON `orders` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_qr_token` ON `orders` (`qr_token`);--> statement-breakpoint
CREATE INDEX `idx_orders_cybersource_txn` ON `orders` (`cybersource_transaction_id`);--> statement-breakpoint
CREATE INDEX `idx_orders_payment_status` ON `orders` (`payment_status`);--> statement-breakpoint
CREATE TABLE `package_items` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(32)))) NOT NULL,
	`item_id` text,
	`package_id` text,
	`item_quantity` integer DEFAULT 0,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	`deleted_at` integer,
	FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_package_items_item` ON `package_items` (`item_id`);--> statement-breakpoint
CREATE INDEX `idx_package_items_package` ON `package_items` (`package_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uidx_package_items` ON `package_items` (`item_id`,`package_id`);--> statement-breakpoint
CREATE TABLE `packages` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(32)))) NOT NULL,
	`title` text,
	`image` text,
	`slug` text,
	`description` text,
	`price` numeric,
	`currency` text DEFAULT 'NPR',
	`is_active` integer DEFAULT 1,
	`created_by` text,
	`created_at` integer DEFAULT (unixepoch()),
	`updated_at` integer DEFAULT (unixepoch()),
	`deleted_at` integer,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE cascade ON DELETE cascade
);
