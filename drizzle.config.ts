import { type Config } from "drizzle-kit";
import { env } from "./src/env";

const isDev = env.NODE_ENV === "development";

export default {
  schema: "./src/yeah/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  ...(isDev
    ? {
        dbCredentials: {
          url: "file:./my.db",
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
