"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Clock, Star, Search, X, Tag } from "lucide-react";

interface BlogTag {
  id: number;
  name: string;
  slug: string;
  _count: { posts: number };
}

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  featured: boolean;
  readingTime: number;
  publishedAt: Date | string | null;
  tags: Array<{ tagId: number; tag: { id: number; name: string; slug: string } }>;
}

interface BlogContentProps {
  posts: Post[];
  allTags: BlogTag[];
}

function formatDate(date: Date | string | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-violet-100 text-violet-800 rounded px-0.5">{part}</mark>
      : part
  );
}

export function BlogContent({ posts, allTags }: BlogContentProps) {
  const searchParams = useSearchParams();
  const activeTagSlug = searchParams.get("tag");
  const [query, setQuery] = useState("");

  const activeTag = activeTagSlug ? allTags.find((t) => t.slug === activeTagSlug) : null;
  const trimmed = query.trim().toLowerCase();

  const filtered = posts.filter((post) => {
    const matchesTag = !activeTagSlug || post.tags.some((pt) => pt.tag.slug === activeTagSlug);
    if (!trimmed) return matchesTag;
    return (
      matchesTag &&
      (post.title.toLowerCase().includes(trimmed) ||
        (post.excerpt ?? "").toLowerCase().includes(trimmed) ||
        post.tags.some((pt) => pt.tag.name.toLowerCase().includes(trimmed)))
    );
  });

  const isFiltering = !!trimmed || !!activeTagSlug;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

      {/* Search bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts by title, excerpt, or tag..."
          className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Active filters row */}
      {isFiltering && (
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="text-sm text-gray-500">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {trimmed && <> for <span className="font-medium text-gray-700">&ldquo;{query}&rdquo;</span></>}
          </span>
          {activeTag && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 border border-violet-200 text-violet-700 text-sm font-medium">
              <Tag className="w-3.5 h-3.5" />
              #{activeTag.name}
              <Link href={query ? `/blog?q=${encodeURIComponent(query)}` : "/blog"} className="ml-1 hover:text-violet-900">
                <X className="w-3 h-3" />
              </Link>
            </span>
          )}
          {(trimmed || activeTagSlug) && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              {activeTagSlug ? (
                <Link href="/blog">Clear all</Link>
              ) : (
                "Clear"
              )}
            </button>
          )}
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-10">

        {/* Posts grid */}
        <div>
          {filtered.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <Search className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="text-gray-400 text-sm">
                {trimmed
                  ? `No posts match "${query}"`
                  : activeTag
                  ? `No posts tagged #${activeTag.name}`
                  : "No posts published yet."}
              </p>
              {isFiltering && (
                <button
                  onClick={() => setQuery("")}
                  className="text-violet-600 text-sm hover:underline"
                >
                  {activeTagSlug ? <Link href="/blog">Clear filters</Link> : "Clear search"}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filtered.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-gray-200 bg-white hover:border-violet-200 hover:shadow-sm transition-all overflow-hidden"
                >
                  {post.coverImage && (
                    <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-5">
                    {post.featured && (
                      <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-violet-700 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full w-fit mb-2">
                        <Star className="w-2.5 h-2.5" />
                        Featured
                      </div>
                    )}
                    <h2 className="text-gray-900 font-semibold text-base leading-snug mb-2 group-hover:text-violet-700 transition-colors line-clamp-2">
                      {trimmed ? highlight(post.title, query) : post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-3">
                        {trimmed ? highlight(post.excerpt, query) : post.excerpt}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.slice(0, 3).map((pt) => (
                        <span
                          key={pt.tagId}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100"
                        >
                          #{pt.tag.name}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
                      {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime}m read
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Tags sidebar */}
        {allTags.length > 0 && (
          <aside className="mt-10 lg:mt-0">
            <div className="sticky top-8">
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Tags</h3>
                <div className="flex flex-col gap-1">
                  {allTags.map((t) => (
                    <Link
                      key={t.id}
                      href={`/blog?tag=${t.slug}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeTagSlug === t.slug
                          ? "bg-violet-50 text-violet-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span>#{t.name}</span>
                      <span className="text-xs text-gray-400">{t._count.posts}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
