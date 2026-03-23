import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Prisma CLI doesn't load .env.local automatically — load it here so
// TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are available for migrations.
loadEnv({ path: ".env.local" });

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: "file:./prisma/dev.db",
  },
  // @ts-ignore — migrate.adapter is a runtime-only API not yet reflected in types
  migrate: {
    async adapter() {
      return new PrismaLibSql({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
    },
  },
});
