import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
	id: text("id").notNull().primaryKey(),
	username: text("username").notNull().unique(),
	password_hash: text("password_hash").notNull(),
});

export const sessionTable = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer("expires_at").notNull(),
});

export const shortUrlTable = sqliteTable("short_url", {
	id: text("id").notNull().primaryKey(),
	originalUrl: text("original_url").notNull(),
	shortCode: text("short_code").notNull(),
	title: text("title").notNull(),
});
