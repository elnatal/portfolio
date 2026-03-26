"use client";

import Image from "next/image";
import Link from "next/link";
import { ProjectPlaceholder } from "@/components/portfolio/project-placeholder";
import { motion, type Variants } from "framer-motion";
import { ExternalLink, Github, Folders, Star, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Project = {
  id: number;
  slug: string;
  name: string;
  summary: string | null;
  description: string | null;
  tags: string;
  images: string;
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  order: number;
};

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Folders className="size-5 text-[#7c3aed]" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c3aed]">
              Portfolio
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Projects
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]" />
        </motion.div>

        {/* Featured projects — larger cards */}
        {featured.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
          >
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} isFeatured />
            ))}
          </motion.div>
        )}

        {/* Rest of projects */}
        {rest.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {rest.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        )}

        {projects.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            No projects yet.
          </p>
        )}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  isFeatured = false,
}: {
  project: Project;
  isFeatured?: boolean;
}) {
  const tags = parseTags(project.tags);
  const coverImage = parseTags(project.images)[0] ?? null;

  return (
    <motion.div
      variants={cardVariants}
      className="glass glass-hover glow-hover group flex flex-col rounded-xl overflow-hidden h-full"
    >
      {/* Cover image / placeholder */}
      <div className="relative w-full aspect-video">
        {coverImage ? (
          <Image src={coverImage} alt={project.name} fill className="object-cover" />
        ) : (
          <ProjectPlaceholder className="absolute inset-0" seed={project.id} />
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-foreground text-base leading-snug">
            {project.name}
          </h3>
          {isFeatured && (
            <Badge className="bg-[#7c3aed]/15 text-[#a78bfa] border border-[#7c3aed]/25 text-[10px] gap-1">
              <Star className="size-2.5" />
              Featured
            </Badge>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-2 shrink-0">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#a78bfa] transition-colors"
              title="View source"
            >
              <Github className="size-4" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#a78bfa] transition-colors"
              title="View live"
            >
              <ExternalLink className="size-4" />
            </a>
          )}
        </div>
      </div>

      {/* Summary or stripped description */}
      {(project.summary || project.description) && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1 mb-4">
          {project.summary ||
            project.description!.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#7c3aed]/10 text-[#a78bfa] border border-[#7c3aed]/15"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* View Details */}
      <Link
        href={`/projects/${project.slug}`}
        className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-[#a78bfa] hover:text-[#c4b5fd] transition-colors group/link"
      >
        View Details
        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
      </Link>
      </div>
    </motion.div>
  );
}
