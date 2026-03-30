import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uniqueSlugForModel } from "@/lib/slug";

export async function GET() {
  const tags = await prisma.blogTag.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { posts: true } } },
  });
  return NextResponse.json(tags);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const slug =
    data.slug?.trim() ||
    (await uniqueSlugForModel(
      (s) => prisma.blogTag.findUnique({ where: { slug: s }, select: { id: true } }),
      data.name
    ));

  const tag = await prisma.blogTag.create({ data: { ...data, slug } });
  return NextResponse.json(tag, { status: 201 });
}
