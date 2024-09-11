import { createId as create_cuid } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const commentsSummary = sqliteTable(
  "comments_summary",
  {
    id: text("id", { mode: "text" }).primaryKey().$default(create_cuid),
    summary: text("summary", { mode: "json" }).notNull(),
    what: text("summary", { mode: "json" }),
    videoId: text("video_id", { length: 11 }).unique().notNull(),
    userId: text("user_id", { length: 36 }).notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    // nameIndex: index("name_idx").on(example.name),
  })
);

export const summaryCommentIds = sqliteTable(
  "summary_comment_ids",
  {
    id: text("id", { mode: "text" }).primaryKey().$default(create_cuid),
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
  },
  (example) => ({
    // nameIndex: index("name_idx").on(example.name),
  })
);
