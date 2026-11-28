import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx --conditions=react-server prisma/seed.ts" },
  // generate (CI, GitHub Pages build) works without a database; migrate and seed need DATABASE_URL.
  datasource: { url: process.env.DATABASE_URL ?? "" },
});
