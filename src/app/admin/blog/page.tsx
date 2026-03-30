import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Pencil, Clock, Eye, Tag } from "lucide-react";
import { VisibilityToggle } from "@/components/admin/visibility-toggle";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  published: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  scheduled: "bg-blue-500/20 text-blue-300 border-blue-500/40",
};

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    include: { tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-gray-400 mt-1 text-sm">{posts.length} posts total</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="border-white/10 text-gray-300 hover:text-white bg-transparent">
            <Link href="/admin/blog/tags">
              <Tag className="w-4 h-4 mr-2" />
              Tags
            </Link>
          </Button>
          <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
            <Link href="/admin/blog/new">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-400">Title</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-gray-400">Tags</TableHead>
              <TableHead className="text-gray-400">
                <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Read</div>
              </TableHead>
              <TableHead className="text-gray-400">
                <div className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Views</div>
              </TableHead>
              <TableHead className="text-gray-400 text-center">Visible</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  No posts yet.{" "}
                  <Link href="/admin/blog/new" className="text-violet-400 hover:underline">
                    Write the first one
                  </Link>
                </TableCell>
              </TableRow>
            )}
            {posts.map((post) => (
              <TableRow key={post.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="text-white font-medium max-w-xs">
                  <div className="truncate">{post.title}</div>
                  {post.featured && (
                    <Badge className="bg-violet-600/20 text-violet-300 border-violet-500/40 text-[10px] mt-1">
                      Featured
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[post.status] ?? STATUS_STYLES.draft}`}>
                    {post.status}
                  </span>
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((pt) => (
                      <span key={pt.tagId} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                        {pt.tag.name}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-[10px] text-gray-500">+{post.tags.length - 2}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {post.readingTime}m
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {post.views.toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  <VisibilityToggle id={post.id} visible={post.visible} endpoint="/api/blog" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Link href={`/admin/blog/${post.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <DeleteButton endpoint={`/api/blog/${post.id}`} label="post" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
