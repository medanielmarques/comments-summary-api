import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";
import { env } from "../src/env.js";
import { Redis } from "@upstash/redis";

interface Comment {
  commentId: string;
  comment: string;
}

async function fetchComments(videoId: string): Promise<Comment[]> {
  const youtube = google.youtube({
    version: "v3",
    auth: env.YOUTUBE_DATA_API_KEY,
  });

  try {
    const commentsResponse = await youtube.commentThreads.list({
      part: ["snippet"],
      videoId,
      maxResults: 50,
      order: "relevance",
    });

    return (
      commentsResponse.data.items?.map((item) => ({
        commentId: item.snippet?.topLevelComment?.id ?? "",
        comment: item.snippet?.topLevelComment?.snippet?.textOriginal ?? "",
      })) ?? []
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const videoId = "LSo7xH7YgaY";
  const comments = await fetchComments(videoId);

  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  const commentsId = comments.map((c) => c.commentId);
  const commentsContent = comments.map((c) => c.comment);

  await redis.sadd(`video:${videoId}:comments-id`, ...commentsId);
  await redis.sadd(`video:${videoId}:comments-content`, ...commentsContent);
  await redis.hset(`video:${videoId}:summary`, {
    videoId,
    summary: null,
  });

  res.status(200).json({
    message: "Comments fetched successfully.",
    comments,
  });
}
