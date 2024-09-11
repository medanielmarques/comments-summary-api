import { type Config } from "drizzle-kit";
import { env } from "./src/env.ts";

const isDev = env.NODE_ENV === "development";

export default {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  ...(isDev
    ? {
        dbCredentials: {
          url: env.DATABASE_URL,
        },
      }
    : {
        driver: "turso",
        dbCredentials: {
          url: env.DATABASE_URL,
          authToken: env.DATABASE_TOKEN,
        },
      }),
} satisfies Config;
