import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { prisma } from "@/lib/prisma";
import { CVDocument } from "@/lib/cv-pdf";
import type { CVData } from "@/lib/cv-pdf";

export const dynamic = "force-dynamic";

export async function GET() {
  const [info, experiences, education, certifications, languages, skills, projects] = await Promise.all([
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

  if (!info) {
    return new Response("No personal info found", { status: 404 });
  }

  const data: CVData = { info, experiences, education, certifications, languages, skills, projects };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(createElement(CVDocument, { data }) as any);

  const filename = `${info.name.toLowerCase().replace(/\s+/g, "-")}-cv.pdf`;

  return new Response(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
