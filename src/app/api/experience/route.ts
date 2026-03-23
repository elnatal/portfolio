import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(experiences);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const experience = await prisma.experience.create({ data });
  return NextResponse.json(experience, { status: 201 });
}
