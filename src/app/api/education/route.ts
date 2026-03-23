import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const education = await prisma.education.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(education);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const edu = await prisma.education.create({ data });
  return NextResponse.json(edu, { status: 201 });
}
