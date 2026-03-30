import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
import { Navbar } from "@/components/layout/navbar";
import { BlogContent } from "@/components/blog/blog-content";

const SITE_URL = "https://elnatal.com";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on software engineering, distributed systems, and web development by Elnatal Debebe.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "Blog — Elnatal Debebe",
    description: "Articles on software engineering, distributed systems, and web development.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Elnatal Debebe",
  },
};

interface BlogPageProps {
  searchParams: Promise<{ q?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { q, tag } = await searchParams;
  const trimmedQ = q?.trim();

  const [posts, allTags] = await Promise.all([
    prisma.blogPost.findMany({
      where: {
        status: "published",
        visible: true,
        ...(trimmedQ ? {
          OR: [
            { title: { contains: trimmedQ } },
            { excerpt: { contains: trimmedQ } },
            { tags: { some: { tag: { name: { contains: trimmedQ } } } } },
          ],
        } : {}),
        ...(tag ? { tags: { some: { tag: { slug: tag } } } } : {}),
      },
      include: { tags: { include: { tag: true } } },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    }),
    prisma.blogTag.findMany({
      where: {
        visible: true,
        posts: { some: { post: { status: "published", visible: true } } },
      },
      include: { _count: { select: { posts: { where: { post: { status: "published", visible: true } } } } } },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.08),transparent)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-3">Blog</h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Thoughts on software engineering, distributed systems, and building things that matter.
          </p>
        </div>
      </div>

      {/* Content — client component handles search + tag filter */}
      <Suspense>
        <BlogContent posts={posts} allTags={allTags} />
      </Suspense>
    </div>
  );
}
