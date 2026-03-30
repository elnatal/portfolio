import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = "https://elnatal.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, tags] = await Promise.all([
    prisma.project.findMany({
      where: { visible: true },
      select: { slug: true, updatedAt: true },
      orderBy: { order: "asc" },
    }),
    prisma.blogPost.findMany({
      where: { status: "published", visible: true },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.blogTag.findMany({
      where: { visible: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: posts[0]?.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    ...projects.map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...tags.map((t) => ({
      url: `${SITE_URL}/blog/tags/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
