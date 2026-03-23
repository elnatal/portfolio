import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const experience = await prisma.experience.findUnique({
    where: { id: Number(id) },
  });
  if (!experience)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(experience);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();
  const experience = await prisma.experience.update({
    where: { id: Number(id) },
    data,
  });
  return NextResponse.json(experience);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.experience.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
