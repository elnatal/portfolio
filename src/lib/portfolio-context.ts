import { prisma } from "@/lib/prisma";

export type PortfolioContext = {
  ownerName: string;
  context: string;
};

function stripHtml(html: string): string {
  return html
    .replace(/<\/?(ul|ol|li|p|br|div|h[1-6])[^>]*>/gi, (tag) =>
      tag.startsWith("</") ? "\n" : ""
    )
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseTags(tagsJson: string): string[] {
  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function buildPortfolioContext(): Promise<PortfolioContext> {
  const [info, experiences, projects, skills, education, certifications, languages] =
    await Promise.all([
      prisma.personalInfo.findFirst(),
      prisma.experience.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      prisma.project.findMany({
        where: { visible: true },
        orderBy: [{ featured: "desc" }, { order: "asc" }],
      }),
      prisma.skill.findMany({
        where: { visible: true },
        orderBy: [{ category: "asc" }, { order: "asc" }],
      }),
      prisma.education.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      prisma.certification.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      prisma.language.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    ]);

  const ownerName = info?.name ?? "the portfolio owner";

  const lines: string[] = [];

  // ABOUT
  lines.push("=== ABOUT ===");
  if (info) {
    lines.push(`Name: ${info.name}`);
    lines.push(`Title: ${info.title}`);
    lines.push(`Location: ${info.location}`);
    lines.push(`Bio: ${stripHtml(info.bio)}`);
    lines.push(`Email: ${info.email}`);
    if (info.phone) lines.push(`Phone: ${info.phone}`);
    if (info.website) lines.push(`Website: ${info.website}`);
    if (info.github) lines.push(`GitHub: ${info.github}`);
    if (info.linkedin) lines.push(`LinkedIn: ${info.linkedin}`);
    if (info.twitter) lines.push(`Twitter: ${info.twitter}`);
  }

  // EXPERIENCE
  lines.push("\n=== EXPERIENCE ===");
  for (const exp of experiences) {
    const end = exp.isCurrent ? "Present" : (exp.endDate ?? "Present");
    const type = exp.type ? ` (${exp.type})` : "";
    lines.push(`- ${exp.role} at ${exp.company}${type} | ${exp.startDate} – ${end} | ${exp.location}`);
    if (exp.description) {
      const desc = stripHtml(exp.description);
      if (desc) {
        desc.split("\n").filter(Boolean).forEach((line) => lines.push(`  ${line}`));
      }
    }
  }

  // PROJECTS
  lines.push("\n=== PROJECTS ===");
  for (const proj of projects) {
    const tags = parseTags(proj.tags);
    const tagStr = tags.length > 0 ? ` [${tags.join(", ")}]` : "";
    lines.push(`- ${proj.name}${tagStr}`);
    const desc = proj.summary ?? (proj.description ? stripHtml(proj.description) : "");
    if (desc) lines.push(`  ${desc}`);
    if (proj.liveUrl) lines.push(`  Live: ${proj.liveUrl}`);
    if (proj.githubUrl) lines.push(`  GitHub: ${proj.githubUrl}`);
  }

  // SKILLS
  lines.push("\n=== SKILLS ===");
  const skillsByCategory = skills.reduce<Record<string, string[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {});
  for (const [category, names] of Object.entries(skillsByCategory)) {
    lines.push(`${category}: ${names.join(", ")}`);
  }

  // EDUCATION
  lines.push("\n=== EDUCATION ===");
  for (const edu of education) {
    const end = edu.isCurrent ? "Present" : (edu.endYear ?? "Present");
    lines.push(`- ${edu.degree} in ${edu.field}, ${edu.institution} (${edu.startYear}–${end})`);
    if (edu.description) {
      const desc = stripHtml(edu.description);
      if (desc) lines.push(`  ${desc}`);
    }
  }

  // CERTIFICATIONS
  lines.push("\n=== CERTIFICATIONS ===");
  for (const cert of certifications) {
    const expiry = cert.expiryDate ? ` | Expires: ${cert.expiryDate}` : "";
    lines.push(`- ${cert.name} by ${cert.issuer} | Issued: ${cert.issueDate}${expiry}`);
    if (cert.credentialUrl) lines.push(`  Credential: ${cert.credentialUrl}`);
  }

  // LANGUAGES
  lines.push("\n=== LANGUAGES ===");
  for (const lang of languages) {
    if (lang.isMother) {
      lines.push(`- ${lang.name}: Native`);
    } else {
      const levels = [
        lang.listening && `Listening: ${lang.listening}`,
        lang.reading && `Reading: ${lang.reading}`,
        lang.writing && `Writing: ${lang.writing}`,
        lang.spokenProduction && `Spoken: ${lang.spokenProduction}`,
      ]
        .filter(Boolean)
        .join(", ");
      lines.push(`- ${lang.name}: ${levels || "Proficient"}`);
    }
  }

  return { ownerName, context: lines.join("\n") };
}
