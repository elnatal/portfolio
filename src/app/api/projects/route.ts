import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uniqueSlug } from "@/lib/slug";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const slug =
    data.slug?.trim() || (await uniqueSlug(prisma, data.name));
  const project = await prisma.project.create({ data: { ...data, slug } });
  return NextResponse.json(project, { status: 201 });
}
