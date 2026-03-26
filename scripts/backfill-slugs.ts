import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { slugify } from "../src/lib/slug";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const projects = await prisma.project.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { id: "asc" },
  });

  const used = new Set<string>();

  for (const project of projects) {
    let candidate = slugify(project.name);
    let counter = 1;

    while (used.has(candidate)) {
      candidate = `${slugify(project.name)}-${counter}`;
      counter++;
    }

    used.add(candidate);

    if (project.slug !== candidate) {
      await prisma.project.update({
        where: { id: project.id },
        data: { slug: candidate },
      });
      console.log(`Updated: "${project.name}" → "${candidate}"`);
    } else {
      console.log(`OK: "${project.name}" → "${project.slug}"`);
    }
  }

  console.log("Backfill complete.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
