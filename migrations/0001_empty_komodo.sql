CREATE TABLE `analytics` (
	`id` text PRIMARY KEY NOT NULL,
	`short_url_id` text NOT NULL,
	`clicked_at` integer NOT NULL,
	`country` text,
	`city` text,
	FOREIGN KEY (`short_url_id`) REFERENCES `short_url`(`id`) ON UPDATE no action ON DELETE no action
);
