import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const certifications = await prisma.certification.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(certifications);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const certification = await prisma.certification.create({ data });
  return NextResponse.json(certification, { status: 201 });
}
