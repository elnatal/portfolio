import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uniqueSlugForModel } from "@/lib/slug";
import { calculateReadingTime } from "@/lib/reading-time";
import { addHeadingIds } from "@/lib/heading-ids";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const tag = searchParams.get("tag");
  const featured = searchParams.get("featured");
  const limit = searchParams.get("limit");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (featured === "true") where.featured = true;
  if (tag) {
    where.tags = { some: { tag: { slug: tag } } };
  }

  const posts = await prisma.blogPost.findMany({
    where,
    include: {
      tags: { include: { tag: true } },
    },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    ...(limit ? { take: Number(limit) } : {}),
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const { tagIds, ...postData } = data;

  const slug =
    postData.slug?.trim() ||
    (await uniqueSlugForModel(
      (s) => prisma.blogPost.findUnique({ where: { slug: s }, select: { id: true } }),
      postData.title
    ));

  const content = postData.content ? addHeadingIds(postData.content) : "";
  const readingTime = calculateReadingTime(content);

  let publishedAt = postData.publishedAt ?? null;
  if (postData.status === "published" && !publishedAt) {
    publishedAt = new Date();
  }

  const post = await prisma.blogPost.create({
    data: {
      ...postData,
      slug,
      content,
      readingTime,
      publishedAt,
      tags: tagIds?.length
        ? { create: tagIds.map((tagId: number) => ({ tagId })) }
        : undefined,
    },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json(post, { status: 201 });
}
