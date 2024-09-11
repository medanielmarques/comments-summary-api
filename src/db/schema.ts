import { createId as cuid } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const commentsSummary = sqliteTable(
  "comments_summary",
  {
    id: text("id", { mode: "text" }).primaryKey().$default(cuid),
    summary: text("summary", { mode: "json" }).notNull(),
    test: text("test", { mode: "json" }),
    videoId: text("video_id", { length: 11 }).unique().notNull(),
    userId: text("user_id", { length: 36 }).notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date()
    ),
  }
  // (table) => ({ nameIndex: index("name_idx").on(table.name) })
);

export const summaryCommentIds = sqliteTable("summary_comment_ids", {
  id: text("id", { mode: "text" }).primaryKey().$default(cuid),
  comment_id: text("comment_id", { length: 24 }).unique().notNull(),
  comment_summary_id: text("comment_summary_id", { length: 30 })
    .notNull()
    .references(() => commentsSummary.id),
  createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
});
