CREATE TABLE `tracks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source` text NOT NULL,
	`title` text NOT NULL,
	`artist` text,
	`url` text NOT NULL,
	`cover_url` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
