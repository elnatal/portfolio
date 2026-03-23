import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const languages = await prisma.language.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(languages);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const language = await prisma.language.create({ data });
  return NextResponse.json(language, { status: 201 });
}
