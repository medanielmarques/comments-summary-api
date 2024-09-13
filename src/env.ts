import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    DATABASE_URL: z.string(),
    DATABASE_TOKEN: z.string().optional(),

    YOUTUBE_DATA_API_KEY: z.string(),
    OPENAI_API_KEY: z.string(),

    SUPABASE_URL: z.string(),
    SUPABASE_ANON_KEY: z.string(),

    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    // HIGHLIGHT_PROJECT_ID: z.string(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_TOKEN: process.env.DATABASE_TOKEN,

    YOUTUBE_DATA_API_KEY: process.env.YOUTUBE_DATA_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,

    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,

    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    // HIGHLIGHT_PROJECT_ID:
    //   process.env.HIGHLIGHT_PROJECT_ID,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
