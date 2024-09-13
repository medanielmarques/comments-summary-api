import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";
import { env } from "../src/env.js";
import { redis } from "../src/lib/redis.js";

function enumerateComments(comments: string[]): string {
  return comments.map((comment, index) => `${index + 1}. ${comment}`).join(" ");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const videoId = req.query.videoId as string;

  const comments = await redis.smembers(`video:${videoId}:comments-content`);
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  try {
    // Create a chat completion with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "user",
          content: ` Summarize the 4 main topics on this comments, keep in mind that content creators will be the ones reading this, so adapt the text accordingly and make it as useful as possible for them. ${enumerateComments(
            comments
          )}`,
        },
      ],
    });

    const summary = completion.choices[0]?.message?.content || "";

    await redis.hset(`video:${videoId}:summary`, {
      videoId,
      summary,
    });

    res.status(200).json({
      message: "Summary created successfully.",
    });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    res.status(400).json({ message: "Failed to create summary" });
  }
}
