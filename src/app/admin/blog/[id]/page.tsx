import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "@/components/admin/blog-post-form";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;

  const [post, allTags] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { id: Number(id) },
      include: { tags: { include: { tag: true } } },
    }),
    prisma.blogTag.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog Posts
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit Post</h1>
        <p className="text-gray-400 mt-1 text-sm">{post.title}</p>
      </div>
      <BlogPostForm post={post} allTags={allTags} />
    </div>
  );
}
