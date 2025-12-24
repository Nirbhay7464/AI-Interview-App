import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",
    dbCredentials: {
    url: 'postgresql://neondb_owner:npg_8oEY4GSPVufz@ep-dark-water-a4ok09e5-pooler.us-east-1.aws.neon.tech/Ai%20Interview%20app?sslmode=require&channel_binding=require',
}});
