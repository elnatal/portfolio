import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uniqueSlugForModel } from "@/lib/slug";

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

  const slug =
    data.slug?.trim() ||
    (await uniqueSlugForModel(
      (s) => prisma.blogTag.findUnique({ where: { slug: s }, select: { id: true } }),
      data.name,
      numericId
    ));

  const tag = await prisma.blogTag.update({
    where: { id: numericId },
    data: { ...data, slug },
  });
  return NextResponse.json(tag);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.blogTag.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
