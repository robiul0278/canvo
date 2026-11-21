import { neonConfig } from "@neondatabase/serverless";
import { defineConfig } from "drizzle-kit";

neonConfig.webSocketConstructor = globalThis.WebSocket;

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});