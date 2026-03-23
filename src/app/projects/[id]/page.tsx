import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Star, Layers, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { ProjectGallery } from "@/components/portfolio/project-gallery";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

const SITE_URL = "https://elnatal.com";

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isHtml(str: string) {
  return /<[a-z][\s\S]*>/i.test(str);
}

function stripHtml(str: string) {
  return str.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (isNaN(id)) return {};

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return {};

  const tags = parseTags(project.tags);
  const images = parseTags(project.images);
  const plainDescription =
    project.summary ??
    (project.description ? stripHtml(project.description).slice(0, 160) : null) ??
    "A project by Elnatal Debebe";
  const ogImage = images[0] ?? "/opengraph-image";
  const canonicalUrl = `${SITE_URL}/projects/${id}`;

  return {
    title: project.name,
    description: plainDescription,
    keywords: tags.length > 0 ? tags : undefined,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: project.name,
      description: plainDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: project.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: plainDescription,
      images: [ogImage],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (isNaN(id)) notFound();

  const [project, related] = await Promise.all([
    prisma.project.findUnique({ where: { id } }),
    prisma.project.findMany({
      where: { id: { not: id } },
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      take: 3,
    }),
  ]);

  if (!project) notFound();

  const tags = parseTags(project.tags);
  const images = parseTags(project.images);
  const descriptionHtml = project.description
    ? isHtml(project.description)
      ? project.description
      : `<p>${project.description}</p>`
    : null;

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: project.name,
            description: project.summary ?? stripHtml(project.description ?? ""),
            url: project.liveUrl ?? `${SITE_URL}/projects/${project.id}`,
            codeRepository: project.githubUrl ?? undefined,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web",
            author: { "@type": "Person", name: "Elnatal Debebe", url: SITE_URL },
            keywords: parseTags(project.tags).join(", "),
          }),
        }}
      />
      {/* ── Hero ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(124,58,237,0.08),transparent)]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-14">
          {/* Back */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors group mb-10"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            All Projects
          </Link>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1 min-w-0">
              {project.featured && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 border border-violet-200 text-violet-700 text-xs font-semibold mb-4">
                  <Star className="size-3" />
                  Featured Project
                </div>
              )}
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
                {project.name}
              </h1>
              {project.summary && (
                <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                  {project.summary}
                </p>
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex items-center gap-3 shrink-0 pt-1">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  Source Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-sm text-white transition-colors font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">

          {/* Left — image + description */}
          <div className="min-w-0">
            {/* Project gallery */}
            <ProjectGallery images={images} name={project.name} seed={project.id} />

            {/* Rich text description */}
            {descriptionHtml && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                <div
                  className="
                    [&_h2]:text-gray-900 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3
                    [&_h2]:pl-3 [&_h2]:border-l-[3px] [&_h2]:border-violet-500 [&_h2]:leading-snug
                    first:[&_h2]:mt-0
                    [&_h3]:text-gray-800 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2
                    [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:mt-3
                    [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mt-3 [&_ul]:space-y-1.5
                    [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mt-3 [&_ol]:space-y-1.5
                    [&_li]:text-gray-700 [&_li]:leading-relaxed
                    [&_strong]:text-gray-900 [&_strong]:font-semibold
                    [&_a]:text-violet-600 [&_a]:underline [&_a:hover]:text-violet-700
                    [&_hr]:border-gray-200 [&_hr]:my-6
                    [&_code]:bg-violet-50 [&_code]:text-violet-700 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                  "
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              </div>
            )}
          </div>

          {/* Right — sticky sidebar */}
          <aside className="mt-8 lg:mt-0">
            <div className="sticky top-8 space-y-5">

              {/* Tech stack */}
              {tags.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="w-4 h-4 text-violet-600" />
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                      Tech Stack
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(project.liveUrl || project.githubUrl) && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                    Links
                  </h3>
                  <div className="flex flex-col gap-2">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-violet-50 border border-violet-100 text-sm text-violet-700 hover:bg-violet-100 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 shrink-0" />
                        <span className="truncate">{project.liveUrl.replace(/^https?:\/\//, "")}</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        <Github className="w-4 h-4 shrink-0" />
                        <span className="truncate">{project.githubUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Back to portfolio */}
              <Link
                href="/#projects"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all projects
              </Link>
            </div>
          </aside>
        </div>

        {/* ── Related projects ─────────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                More Projects
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {related.map((p) => {
                const pTags = parseTags(p.tags);
                return (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 hover:border-violet-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm leading-snug">
                        {p.name}
                      </h4>
                      {p.featured && (
                        <Badge className="bg-violet-50 text-violet-700 border border-violet-100 text-[10px] shrink-0">
                          <Star className="size-2.5 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    {(p.summary || p.description) && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-3">
                        {p.summary || stripHtml(p.description!).slice(0, 120)}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {pTags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-violet-600 group-hover:text-violet-700 transition-colors mt-auto">
                      View project
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
