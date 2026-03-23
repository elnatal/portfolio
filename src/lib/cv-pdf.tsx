import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
} from "@react-pdf/renderer";

// ── Types ─────────────────────────────────────────────────────────────────────
interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
}

interface Experience {
  company: string;
  role: string;
  type?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  location: string;
  description?: string | null;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear?: string | null;
  isCurrent: boolean;
  description?: string | null;
}

interface Skill {
  name: string;
  category: string;
}

interface Project {
  name: string;
  summary?: string | null;
  description?: string | null;
  tags: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
}

interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string | null;
}

interface Language {
  name: string;
  isMother: boolean;
  listening?: string | null;
  reading?: string | null;
  writing?: string | null;
  spokenProduction?: string | null;
  spokenInteraction?: string | null;
}

export interface CVData {
  info: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseTags(raw: string): string[] {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

/** Convert HTML to bullet lines for PDF output */
function htmlToBullets(html: string | null | undefined): string[] {
  if (!html) return [];
  // Extract <li> items first
  const liMatches = Array.from(html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi));
  if (liMatches.length > 0) {
    return liMatches
      .map((m) => m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim())
      .filter(Boolean);
  }
  // Fall back: strip all tags, split by sentences / newlines
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain ? [plain] : [];
}

function groupSkills(skills: Skill[]): Record<string, string[]> {
  return skills.reduce<Record<string, string[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s.name);
    return acc;
  }, {});
}

// ── Styles ────────────────────────────────────────────────────────────────────
const C = {
  accent: "#6d28d9",
  name: "#0f172a",
  heading: "#1e293b",
  body: "#334155",
  muted: "#64748b",
  rule: "#e2e8f0",
  bullet: "#7c3aed",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.body,
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 44,
    // no global lineHeight — set explicitly per element to avoid Yoga miscalc
  },

  // ── Header ──
  header: { marginBottom: 10 },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    color: C.name,
    letterSpacing: 0.5,
    lineHeight: 1.15,   // keeps 22pt name from ballooning
  },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    color: C.accent,
    lineHeight: 1.2,
    marginTop: 3,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 3,
  },
  contactItem: {
    fontSize: 8.5,
    color: C.muted,
    lineHeight: 1.3,
  },
  contactLink: {
    fontSize: 8.5,
    color: C.accent,
    lineHeight: 1.3,
    textDecoration: "none",
  },
  contactSep: {
    fontSize: 8.5,
    color: C.rule,
    lineHeight: 1.3,
    marginHorizontal: 4,
  },
  headerRule: {
    borderBottomWidth: 1.5,
    borderBottomColor: C.accent,
    marginTop: 8,
  },

  // ── Section ──
  section: { marginTop: 14 },
  sectionHeader: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: C.accent,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    lineHeight: 1.2,
    paddingBottom: 3,
    marginBottom: 5,
    borderBottomWidth: 0.75,
    borderBottomColor: C.rule,
  },

  // ── Experience ──
  expEntry: { marginTop: 8 },
  expTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  expCompany: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: C.heading,
    lineHeight: 1.25,
  },
  expDate: {
    fontSize: 8.5,
    color: C.muted,
    lineHeight: 1.25,
    flexShrink: 0,
    marginLeft: 8,
  },
  expRole: {
    fontSize: 9,
    color: C.accent,
    lineHeight: 1.25,
    marginTop: 2,
  },
  expLocation: {
    fontSize: 8.5,
    color: C.muted,
    lineHeight: 1.25,
    marginTop: 2,
    marginBottom: 4,
  },
  bullet: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 3,
  },
  bulletDot: {
    fontSize: 8.5,
    color: C.bullet,
    lineHeight: 1.45,
    flexShrink: 0,
    marginRight: 5,
  },
  bulletText: {
    fontSize: 8.5,
    color: C.body,
    lineHeight: 1.45,
    flex: 1,
  },

  // ── Education ──
  eduEntry: { marginTop: 8 },
  eduTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  eduInstitution: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: C.heading,
    lineHeight: 1.25,
  },
  eduDate: {
    fontSize: 8.5,
    color: C.muted,
    lineHeight: 1.25,
  },
  eduDegree: {
    fontSize: 9,
    color: C.body,
    lineHeight: 1.3,
    marginTop: 2,
  },

  // ── Skills ──
  skillRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
  },
  skillCategory: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: C.heading,
    lineHeight: 1.45,
    width: 110,
    flexShrink: 0,
  },
  skillList: {
    fontSize: 8.5,
    color: C.body,
    lineHeight: 1.45,
    flex: 1,
  },

  // ── Projects ──
  projEntry: { marginTop: 8 },
  projTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  projName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: C.heading,
    lineHeight: 1.25,
  },
  projLinks: {
    flexDirection: "row",
    flexShrink: 0,
    marginLeft: 8,
  },
  projLink: {
    fontSize: 8,
    color: C.accent,
    lineHeight: 1.25,
    textDecoration: "none",
    marginLeft: 6,
  },
  projTags: {
    fontSize: 8.5,
    color: C.muted,
    lineHeight: 1.3,
    marginTop: 2,
    marginBottom: 3,
  },
  projDesc: {
    fontSize: 8.5,
    color: C.body,
    lineHeight: 1.45,
  },

  // ── Certifications ──
  certEntry: { marginTop: 6 },
  certTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  certName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: C.heading,
    lineHeight: 1.25,
  },
  certDate: {
    fontSize: 8.5,
    color: C.muted,
    lineHeight: 1.25,
    flexShrink: 0,
    marginLeft: 8,
  },
  certIssuer: {
    fontSize: 8.5,
    color: C.accent,
    lineHeight: 1.25,
    marginTop: 1,
  },

  // ── Summary ──
  summaryText: {
    fontSize: 9,
    color: C.body,
    lineHeight: 1.5,
    marginTop: 4,
  },
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

// ── Document ─────────────────────────────────────────────────────────────────
export function CVDocument({ data }: { data: CVData }) {
  const { info, experiences, education, skills, projects, certifications, languages } = data;
  const skillGroups = groupSkills(skills);

  // Contact row items: plain text or hyperlink
  type ContactItem = { text: string; url?: string };
  const contactItems: ContactItem[] = [
    info.email ? { text: info.email } : null,
    info.phone ? { text: info.phone } : null,
    info.github   ? { text: info.github.replace(/^https?:\/\/(www\.)?/, ""),   url: info.github   } : null,
    info.linkedin ? { text: "LinkedIn",                                         url: info.linkedin } : null,
    info.website  ? { text: info.website.replace(/^https?:\/\/(www\.)?/, ""),  url: info.website  } : null,
  ].filter(Boolean) as ContactItem[];

  return (
    <Document
      title={`${info.name} — CV`}
      author={info.name}
      subject="Curriculum Vitae"
      keywords="software engineer developer resume cv"
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

        {/* ── Professional Summary ── */}
        <View style={s.section}>
          <SectionHeader title="Professional Summary" />
          <Text style={s.summaryText}>{info.bio}</Text>
        </View>

        {/* ── Work Experience ── */}
        {experiences.length > 0 && (
          <View style={s.section}>
            <SectionHeader title="Work Experience" />
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
                  <Text style={s.eduDegree}>
                    {edu.degree} in {edu.field}
                  </Text>
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
            {/* Mother tongues */}
            {languages.filter((l) => l.isMother).length > 0 && (
              <View style={s.skillRow}>
                <Text style={s.skillCategory}>Mother tongue:</Text>
                <Text style={s.skillList}>
                  {languages.filter((l) => l.isMother).map((l) => l.name).join(", ")}
                </Text>
              </View>
            )}
            {/* Other languages */}
            {languages.filter((l) => !l.isMother).map((l, i) => (
              <View key={i} style={{ marginTop: 5 }}>
                <Text style={{ ...s.skillCategory, marginBottom: 2 }}>{l.name}</Text>
                <Text style={s.skillList}>
                  {[
                    l.listening         ? `Listening ${l.listening}`         : null,
                    l.reading           ? `Reading ${l.reading}`             : null,
                    l.writing           ? `Writing ${l.writing}`             : null,
                    l.spokenProduction  ? `Spoken Production ${l.spokenProduction}`  : null,
                    l.spokenInteraction ? `Spoken Interaction ${l.spokenInteraction}` : null,
                  ].filter(Boolean).join("   ·   ")}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Skills ── */}
        {Object.keys(skillGroups).length > 0 && (
          <View style={s.section}>
            <SectionHeader title="Technical Skills" />
            {Object.entries(skillGroups).map(([cat, names]) => (
              <View key={cat} style={s.skillRow}>
                <Text style={s.skillCategory}>{cat}:</Text>
                <Text style={s.skillList}>{names.join(", ")}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Projects ── */}
        {projects.length > 0 && (
          <View style={s.section}>
            <SectionHeader title="Projects" />
            {projects.map((p, i) => {
              const tags = parseTags(p.tags);
              const desc = p.summary || htmlToBullets(p.description)[0] || "";
              return (
                <View key={i} style={s.projEntry} wrap={false}>
                  <View style={s.projTop}>
                    <Text style={s.projName}>{p.name}</Text>
                    <View style={s.projLinks}>
                      {p.githubUrl && (
                        <Link src={p.githubUrl} style={s.projLink}>
                          GitHub
                        </Link>
                      )}
                      {p.liveUrl && (
                        <Link src={p.liveUrl} style={s.projLink}>
                          Live
                        </Link>
                      )}
                    </View>
                  </View>
                  {tags.length > 0 && (
                    <Text style={s.projTags}>{tags.join(" · ")}</Text>
                  )}
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
