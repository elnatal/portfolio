import { Feed } from "feed";
import { prisma } from "@/lib/prisma";

const SITE_URL = "https://elnatal.com";

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "published", visible: true },
    include: { tags: { include: { tag: true } } },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });

  const feed = new Feed({
    title: "Elnatal Debebe — Blog",
    description: "Articles on software engineering, distributed systems, and web development.",
    id: `${SITE_URL}/blog`,
    link: `${SITE_URL}/blog`,
    language: "en",
    feedLinks: { rss2: `${SITE_URL}/blog/feed.xml` },
    author: { name: "Elnatal Debebe", link: SITE_URL },
    copyright: `© ${new Date().getFullYear()} Elnatal Debebe`,
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `${SITE_URL}/blog/${post.slug}`,
      link: `${SITE_URL}/blog/${post.slug}`,
      description: post.excerpt ?? undefined,
      content: post.content,
      date: post.publishedAt ?? post.createdAt,
      category: post.tags.map((pt) => ({ name: pt.tag.name })),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
