import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CVData } from "@/lib/cv-pdf";

// Re-export CVData so callers can use a single import
export type { CVData };

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseTags(raw: string): string[] {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function htmlToBullets(html: string | null | undefined): string[] {
  if (!html) return [];
  const liMatches = Array.from(html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi));
  if (liMatches.length > 0) {
    return liMatches
      .map((m) => m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim())
      .filter(Boolean);
  }
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain ? [plain] : [];
}

function groupSkills(skills: CVData["skills"]): Record<string, string[]> {
  return skills.reduce<Record<string, string[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s.name);
    return acc;
  }, {});
}

// ── Styles ────────────────────────────────────────────────────────────────────
const C = {
  accent:  "#6d28d9",
  name:    "#0f172a",
  heading: "#1e293b",
  body:    "#334155",
  muted:   "#64748b",
  rule:    "#e2e8f0",
  bullet:  "#7c3aed",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8.5,
    color: C.body,
    paddingTop: 32,
    paddingBottom: 36,
    paddingHorizontal: 40,
  },

  // ── Header ──
  header:     { marginBottom: 8 },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    color: C.name,
    letterSpacing: 0.5,
    lineHeight: 1.15,
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: C.accent,
    lineHeight: 1.2,
    marginTop: 2,
    marginBottom: 5,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 2,
  },
  contactItem: { fontSize: 8, color: C.muted, lineHeight: 1.3 },
  contactLink: { fontSize: 8, color: C.accent, lineHeight: 1.3, textDecoration: "none" },
  contactSep:  { fontSize: 8, color: C.rule,   lineHeight: 1.3, marginHorizontal: 4 },
  headerRule: {
    borderBottomWidth: 1.5,
    borderBottomColor: C.accent,
    marginTop: 7,
  },

  // ── Section ──
  section: { marginTop: 11 },
  sectionHeader: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: C.accent,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    lineHeight: 1.2,
    paddingBottom: 3,
    marginBottom: 4,
    borderBottomWidth: 0.75,
    borderBottomColor: C.rule,
  },

  // ── Summary ──
  summaryText: { fontSize: 8.5, color: C.body, lineHeight: 1.5, marginTop: 3 },

  // ── Experience ──
  expEntry:   { marginTop: 7 },
  expTop:     { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  expCompany: { fontFamily: "Helvetica-Bold", fontSize: 9, color: C.heading, lineHeight: 1.25 },
  expDate:    { fontSize: 8, color: C.muted, lineHeight: 1.25, flexShrink: 0, marginLeft: 8 },
  expRole:    { fontSize: 8.5, color: C.accent, lineHeight: 1.25, marginTop: 1 },
  bullet:     { flexDirection: "row", alignItems: "flex-start", marginTop: 2.5 },
  bulletDot:  { fontSize: 8, color: C.bullet, lineHeight: 1.4, flexShrink: 0, marginRight: 4 },
  bulletText: { fontSize: 8, color: C.body, lineHeight: 1.4, flex: 1 },

  // ── Skills ──
  skillRow:      { flexDirection: "row", alignItems: "flex-start", marginTop: 3.5 },
  skillCategory: { fontFamily: "Helvetica-Bold", fontSize: 8, color: C.heading, lineHeight: 1.4, width: 100, flexShrink: 0 },
  skillList:     { fontSize: 8, color: C.body, lineHeight: 1.4, flex: 1 },

  // ── Education ──
  eduEntry:      { marginTop: 7 },
  eduTop:        { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  eduInstitution:{ fontFamily: "Helvetica-Bold", fontSize: 9, color: C.heading, lineHeight: 1.25 },
  eduDate:       { fontSize: 8, color: C.muted, lineHeight: 1.25 },
  eduDegree:     { fontSize: 8.5, color: C.body, lineHeight: 1.3, marginTop: 1.5 },

  // ── Certifications ──
  certEntry: { marginTop: 5 },
  certTop:   { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  certName:  { fontFamily: "Helvetica-Bold", fontSize: 8.5, color: C.heading, lineHeight: 1.25 },
  certDate:  { fontSize: 8, color: C.muted, lineHeight: 1.25, flexShrink: 0, marginLeft: 8 },
  certIssuer:{ fontSize: 8, color: C.accent, lineHeight: 1.25, marginTop: 1 },

  // ── Projects (featured only) ──
  projEntry: { marginTop: 6 },
  projTop:   { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  projName:  { fontFamily: "Helvetica-Bold", fontSize: 8.5, color: C.heading, lineHeight: 1.25 },
  projLinks: { flexDirection: "row", flexShrink: 0, marginLeft: 8 },
  projLink:  { fontSize: 7.5, color: C.accent, lineHeight: 1.25, textDecoration: "none", marginLeft: 6 },
  projTags:  { fontSize: 8, color: C.muted, lineHeight: 1.3, marginTop: 1.5 },
  projDesc:  { fontSize: 8, color: C.body, lineHeight: 1.4, marginTop: 1.5 },
});

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return <Text style={s.sectionHeader}>{title}</Text>;
}

function BulletList({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <View key={i} style={s.bullet}>
          <Text style={s.bulletDot}>•</Text>
          <Text style={s.bulletText}>{line}</Text>
        </View>
      ))}
    </>
  );
}

// ── Document ──────────────────────────────────────────────────────────────────
export function ResumeDocument({ data }: { data: CVData }) {
  const { info, experiences, education, skills, projects, certifications, languages } = data;
  const skillGroups = groupSkills(skills);

  // Only featured projects for the resume
  const featuredProjects = (projects as (CVData["projects"][number] & { featured?: boolean })[])
    .filter((p) => p.featured)
    .slice(0, 3);

  type ContactItem = { text: string; url?: string };
  const contactItems: ContactItem[] = [
    info.email    ? { text: info.email }                                                            : null,
    info.phone    ? { text: info.phone }                                                            : null,
    info.github   ? { text: info.github.replace(/^https?:\/\/(www\.)?/, ""),   url: info.github   } : null,
    info.linkedin ? { text: "LinkedIn",                                         url: info.linkedin } : null,
    info.website  ? { text: info.website.replace(/^https?:\/\/(www\.)?/, ""),  url: info.website  } : null,
  ].filter(Boolean) as ContactItem[];

  return (
    <Document
      title={`${info.name} — Resume`}
      author={info.name}
      subject="Resume"
      keywords="software engineer developer resume"
      creator="Portfolio"
    >
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.name}>{info.name.toUpperCase()}</Text>
          <Text style={s.title}>{info.title}</Text>
          <View style={s.contactRow}>
            {contactItems.map((item, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
                {i > 0 && <Text style={s.contactSep}>·</Text>}
                {item.url ? (
                  <Link src={item.url} style={s.contactLink}>{item.text}</Link>
                ) : (
                  <Text style={s.contactItem}>{item.text}</Text>
                )}
              </View>
            ))}
          </View>
          <View style={s.headerRule} />
        </View>

        {/* ── Summary ── */}
        <View style={s.section}>
          <SectionHeader title="Summary" />
          <Text style={s.summaryText}>{info.bio}</Text>
        </View>

        {/* ── Experience ── */}
        {experiences.length > 0 && (
          <View style={s.section}>
            <SectionHeader title="Experience" />
            {experiences.map((exp, i) => {
              const bullets = htmlToBullets(exp.description);
              const dateRange = `${exp.startDate} – ${exp.isCurrent ? "Present" : (exp.endDate ?? "")}`;
              const roleLabel = exp.type ? `${exp.role}  ·  ${exp.type}` : exp.role;
              return (
                <View key={i} style={s.expEntry} wrap={false}>
                  <View style={s.expTop}>
                    <Text style={s.expCompany}>{exp.company}</Text>
                    <Text style={s.expDate}>{dateRange}</Text>
                  </View>
                  <Text style={s.expRole}>{roleLabel}</Text>
                  {bullets.length > 0 && <BulletList lines={bullets} />}
                </View>
              );
            })}
          </View>
        )}

        {/* ── Skills ── */}
        {Object.keys(skillGroups).length > 0 && (
          <View style={s.section}>
            <SectionHeader title="Skills" />
            {Object.entries(skillGroups).map(([cat, names]) => (
              <View key={cat} style={s.skillRow}>
                <Text style={s.skillCategory}>{cat}:</Text>
                <Text style={s.skillList}>{names.join(", ")}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Education ── */}
        {education.length > 0 && (
          <View style={s.section}>
            <SectionHeader title="Education" />
            {education.map((edu, i) => {
              const years = `${edu.startYear} – ${edu.isCurrent ? "Present" : (edu.endYear ?? "")}`;
              return (
                <View key={i} style={s.eduEntry} wrap={false}>
                  <View style={s.eduTop}>
                    <Text style={s.eduInstitution}>{edu.institution}</Text>
                    <Text style={s.eduDate}>{years}</Text>
                  </View>
                  <Text style={s.eduDegree}>{edu.degree} in {edu.field}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* ── Certifications ── */}
        {certifications.length > 0 && (
          <View style={s.section}>
            <SectionHeader title="Certifications" />
            {certifications.map((cert, i) => {
              const dateRange = cert.expiryDate
                ? `${cert.issueDate} – ${cert.expiryDate}`
                : cert.issueDate;
              return (
                <View key={i} style={s.certEntry} wrap={false}>
                  <View style={s.certTop}>
                    <Text style={s.certName}>{cert.name}</Text>
                    <Text style={s.certDate}>{dateRange}</Text>
                  </View>
                  <Text style={s.certIssuer}>{cert.issuer}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* ── Languages ── */}
        {languages.length > 0 && (
          <View style={s.section}>
            <SectionHeader title="Languages" />
            <View style={s.skillRow}>
              <Text style={s.skillList}>
                {languages.map((l) =>
                  l.isMother
                    ? `${l.name} (Native)`
                    : `${l.name} (${[l.listening, l.reading, l.writing].filter(Boolean)[0] ?? "Proficient"})`
                ).join("   ·   ")}
              </Text>
            </View>
          </View>
        )}

        {/* ── Featured Projects ── */}
        {featuredProjects.length > 0 && (
          <View style={s.section}>
            <SectionHeader title="Projects" />
            {featuredProjects.map((p, i) => {
              const tags = parseTags(p.tags);
              const desc = p.summary || htmlToBullets(p.description)[0] || "";
              return (
                <View key={i} style={s.projEntry} wrap={false}>
                  <View style={s.projTop}>
                    <Text style={s.projName}>{p.name}</Text>
                    <View style={s.projLinks}>
                      {p.githubUrl && <Link src={p.githubUrl} style={s.projLink}>GitHub</Link>}
                      {p.liveUrl   && <Link src={p.liveUrl}   style={s.projLink}>Live</Link>}
                    </View>
                  </View>
                  {tags.length > 0 && <Text style={s.projTags}>{tags.join(" · ")}</Text>}
                  {desc && <Text style={s.projDesc}>{desc}</Text>}
                </View>
              );
            })}
          </View>
        )}

      </Page>
    </Document>
  );
}
