CREATE TABLE `playlist_tracks` (
	`playlist_id` integer NOT NULL,
	`track_id` integer NOT NULL,
	PRIMARY KEY(`playlist_id`, `track_id`),
	FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON UPDATE no action ON DELETE no action
);
