import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../src/db/index.js";
import { commentsSummary, summaryCommentIds } from "../src/db/schema.js";
import { redis } from "../src/lib/redis.js";

type VideoInfo = {
  videoId: string;
  summary: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const videoId = req.query.videoId as string;

  const commentsId = await redis.smembers(`video:${videoId}:comments-id`);
  const videoInfo: VideoInfo | null = await redis.hgetall(
    `video:${videoId}:summary`
  );

  try {
    const [commentSummary] = await db
      .insert(commentsSummary)
      .values({
        summary: videoInfo?.summary || "",
        videoId: videoInfo?.videoId || "",
        userId: "ctx.user!.id",
        // userId: ctx.user!.id,
      })
      .returning({ id: commentsSummary.id });

    await Promise.all(
      commentsId.map(async (commentId) => {
        await db.insert(summaryCommentIds).values({
          comment_id: commentId,
          comment_summary_id: commentSummary?.id,
        });
      })
    );

    await redis.del(`video:${videoId}:summary`);
    await redis.del(`video:${videoId}:comments-id`);
    await redis.del(`video:${videoId}:comments-content`);

    res.status(200).json({ message: "Data inserted successfully." });
  } catch (error) {
    console.error("Failed to insert data", error);
    res.status(400).json({ message: "Failed to insert data" });
  }
}
