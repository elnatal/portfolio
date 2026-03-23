import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [info, experiences, education, certifications, languages, skills, projects] =
    await Promise.all([
      prisma.personalInfo.findFirst(),
      prisma.experience.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      prisma.education.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      prisma.certification.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      prisma.language.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      prisma.skill.findMany({ where: { visible: true }, orderBy: [{ category: "asc" }, { order: "asc" }] }),
      prisma.project.findMany({
        where: { visible: true },
        orderBy: [{ featured: "desc" }, { order: "asc" }],
      }),
    ]);

  if (!info) return Response.json({ error: "No personal info found" }, { status: 404 });

  return Response.json({ info, experiences, education, certifications, languages, skills, projects });
}
