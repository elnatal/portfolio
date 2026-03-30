import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uniqueSlugForModel } from "@/lib/slug";
import { calculateReadingTime } from "@/lib/reading-time";
import { addHeadingIds } from "@/lib/heading-ids";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id: Number(id) },
    include: { tags: { include: { tag: true } } },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numericId = Number(id);
  const data = await req.json();
  const { tagIds, ...postData } = data;

  let slug: string | undefined;
  if (postData.slug !== undefined) {
    slug = await uniqueSlugForModel(
      (s) => prisma.blogPost.findUnique({ where: { slug: s }, select: { id: true } }),
      postData.slug,
      numericId
    );
  } else if (postData.title) {
    const existing = await prisma.blogPost.findUnique({
      where: { id: numericId },
      select: { title: true },
    });
    if (existing && existing.title !== postData.title) {
      slug = await uniqueSlugForModel(
        (s) => prisma.blogPost.findUnique({ where: { slug: s }, select: { id: true } }),
        postData.title,
        numericId
      );
    }
  }

  const content = postData.content ? addHeadingIds(postData.content) : undefined;
  const readingTime = content ? calculateReadingTime(content) : undefined;

  // Set publishedAt when promoting to published
  let publishedAt = postData.publishedAt;
  if (postData.status === "published" && publishedAt === undefined) {
    const existing = await prisma.blogPost.findUnique({
      where: { id: numericId },
      select: { publishedAt: true, status: true },
    });
    if (existing && existing.status !== "published" && !existing.publishedAt) {
      publishedAt = new Date();
    }
  }

  // Replace tags: delete existing, recreate
  if (tagIds !== undefined) {
    await prisma.blogPostTag.deleteMany({ where: { postId: numericId } });
  }

  const post = await prisma.blogPost.update({
    where: { id: numericId },
    data: {
      ...postData,
      ...(slug ? { slug } : {}),
      ...(content !== undefined ? { content } : {}),
      ...(readingTime !== undefined ? { readingTime } : {}),
      ...(publishedAt !== undefined ? { publishedAt } : {}),
      ...(tagIds !== undefined
        ? { tags: { create: tagIds.map((tagId: number) => ({ tagId })) } }
        : {}),
    },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json(post);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
