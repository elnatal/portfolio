import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Eye, Tag, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
import { extractToc } from "@/lib/heading-ids";
import { highlightCodeBlocks } from "@/lib/highlight-code";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { ShareButtons } from "@/components/blog/share-buttons";
import { ReactButton } from "@/components/blog/react-button";
import { ViewTracker } from "@/components/blog/view-tracker";

const SITE_URL = "https://elnatal.com";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { tags: { include: { tag: true } } },
  });
  if (!post || post.status !== "published") return {};

  const canonicalUrl = `${SITE_URL}/blog/${slug}`;
  const description = post.excerpt ?? post.content.replace(/<[^>]+>/g, " ").slice(0, 160).trim();

  return {
    title: post.title,
    description,
    keywords: post.tags.map((pt) => pt.tag.name),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: post.title,
      description,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: ["Elnatal Debebe"],
      images: post.coverImage
        ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
        : ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : ["/opengraph-image"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { tags: { include: { tag: true } } },
  });

  if (!post || post.status !== "published" || !post.visible) notFound();

  // Get related posts (by shared tags, excluding this post)
  const tagIds = post.tags.map((pt) => pt.tagId);
  const relatedPosts = tagIds.length
    ? await prisma.blogPost.findMany({
        where: {
          status: "published",
          visible: true,
          slug: { not: slug },
          tags: { some: { tagId: { in: tagIds } } },
        },
        include: { tags: { include: { tag: true } } },
        orderBy: { publishedAt: "desc" },
        take: 3,
      })
    : [];

  const toc = extractToc(post.content);
  const contentHtml = await highlightCodeBlocks(post.content);
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImage ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: "Elnatal Debebe", url: SITE_URL },
    publisher: { "@type": "Person", name: "Elnatal Debebe" },
    url: canonicalUrl,
    keywords: post.tags.map((pt) => pt.tag.name).join(", "),
    timeRequired: `PT${post.readingTime}M`,
  };

  return (
    <div className="min-h-screen bg-background">
      <ViewTracker postId={post.id} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
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

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((pt) => (
                <Link
                  key={pt.tagId}
                  href={`/blog?tag=${pt.tag.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-violet-100 border border-violet-200 text-violet-700 hover:bg-violet-200 transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  {pt.tag.name}
                </Link>
              ))}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-4">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mb-5">{post.excerpt}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readingTime} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.views.toLocaleString()} views
            </span>
          </div>
        </div>
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-gray-200">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-10">

          {/* Article body */}
          <article className="min-w-0">
            {post.aiSummary && (
              <div className="mb-8 rounded-xl border border-violet-200 bg-violet-50 p-5">
                <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-2">AI Summary</p>
                <p className="text-gray-700 text-sm leading-relaxed">{post.aiSummary}</p>
              </div>
            )}

            <div
              className="
                blog-content
                [&_h2]:text-gray-900 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4
                [&_h2]:pl-3 [&_h2]:border-l-[3px] [&_h2]:border-violet-500 [&_h2]:leading-snug
                first:[&_h2]:mt-0
                [&_h3]:text-gray-800 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-7 [&_h3]:mb-3
                [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mt-4
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-4 [&_ul]:space-y-2
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mt-4 [&_ol]:space-y-2
                [&_li]:text-gray-700 [&_li]:leading-relaxed
                [&_strong]:text-gray-900 [&_strong]:font-semibold
                [&_em]:text-gray-700 [&_em]:italic
                [&_a]:text-violet-600 [&_a]:underline [&_a:hover]:text-violet-700
                [&_blockquote]:border-l-4 [&_blockquote]:border-violet-300 [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-6 [&_blockquote]:text-gray-600 [&_blockquote]:italic
                [&_hr]:border-gray-200 [&_hr]:my-8
                [&_code]:bg-violet-50 [&_code]:text-violet-700 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                [&_pre]:my-6 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:text-sm
                [&_pre_code]:bg-transparent [&_pre_code]:text-inherit [&_pre_code]:px-0 [&_pre_code]:py-0 [&_pre_code]:rounded-none
                [&_img]:rounded-xl [&_img]:border [&_img]:border-gray-200 [&_img]:my-6
                [&_table]:w-full [&_table]:my-6 [&_table]:text-sm
                [&_th]:text-left [&_th]:font-semibold [&_th]:text-gray-900 [&_th]:border-b [&_th]:border-gray-200 [&_th]:pb-2
                [&_td]:text-gray-700 [&_td]:border-b [&_td]:border-gray-100 [&_td]:py-2
              "
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </article>

          {/* Sticky sidebar */}
          <aside className="mt-10 lg:mt-0">
            <div className="sticky top-8 space-y-4">
              <TableOfContents items={toc} />
              <ShareButtons url={canonicalUrl} title={post.title} />
              <ReactButton postId={post.id} initialReactions={post.reactions} />
              <Link
                href="/blog"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all posts
              </Link>
            </div>
          </aside>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">More Posts</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 hover:border-violet-200 hover:shadow-sm transition-all"
                >
                  <h4 className="font-semibold text-gray-900 text-sm leading-snug mb-2 group-hover:text-violet-700 transition-colors line-clamp-2">
                    {rp.title}
                  </h4>
                  {rp.excerpt && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-3">
                      {rp.excerpt}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {rp.tags.slice(0, 2).map((pt) => (
                      <span key={pt.tagId} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                        #{pt.tag.name}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-violet-600 group-hover:text-violet-700 transition-colors mt-auto">
                    Read post
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
