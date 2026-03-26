import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uniqueSlug } from "@/lib/slug";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
  });
  if (!project)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
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

  let slug: string | undefined;
  if (data.slug !== undefined) {
    slug = await uniqueSlug(prisma, data.slug, numericId);
  } else if (data.name) {
    const existing = await prisma.project.findUnique({
      where: { id: numericId },
      select: { name: true },
    });
    if (existing && existing.name !== data.name) {
      slug = await uniqueSlug(prisma, data.name, numericId);
    }
  }

  const project = await prisma.project.update({
    where: { id: numericId },
    data: slug ? { ...data, slug } : data,
  });
  return NextResponse.json(project);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.project.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
