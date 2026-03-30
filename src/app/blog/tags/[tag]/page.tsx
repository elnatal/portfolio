import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

const SITE_URL = "https://elnatal.com";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const blogTag = await prisma.blogTag.findUnique({ where: { slug: tag } });
  if (!blogTag) return {};

  return {
    title: `Posts tagged #${blogTag.name}`,
    description: `Blog posts tagged with ${blogTag.name} by Elnatal Debebe.`,
    alternates: { canonical: `${SITE_URL}/blog/tags/${tag}` },
  };
}

export default async function TagFilterPage({ params }: TagPageProps) {
  const { tag } = await params;

  const blogTag = await prisma.blogTag.findUnique({ where: { slug: tag } });
  if (!blogTag) notFound();

  const posts = await prisma.blogPost.findMany({
    where: {
      status: "published",
      visible: true,
      tags: { some: { tagId: blogTag.id } },
    },
    include: { tags: { include: { tag: true } } },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.08),transparent)]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors group mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            All Posts
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 border border-violet-200 text-violet-700 font-semibold text-lg">
              <Tag className="w-5 h-5" />
              #{blogTag.name}
            </div>
          </div>
          <p className="text-gray-500 text-base mt-2">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No published posts with this tag yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white hover:border-violet-200 hover:shadow-sm transition-all overflow-hidden"
              >
                {post.coverImage && (
                  <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-5">
                  <h2 className="text-gray-900 font-semibold text-sm leading-snug mb-2 group-hover:text-violet-700 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 flex-1 mb-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
                    {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime}m
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
