import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.blogPost.update({
    where: { id: Number(id) },
    data: { views: { increment: 1 } },
    select: { views: true },
  });
  return NextResponse.json(post);
}
