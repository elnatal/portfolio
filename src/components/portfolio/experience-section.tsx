"use client";

import { motion, type Variants } from "framer-motion";
import { MapPin, Calendar, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Experience = {
  id: number;
  company: string;
  role: string;
  type: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  location: string;
  description: string | null;
  order: number;
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export function ExperienceSection({
  experiences,
}: {
  experiences: Experience[];
}) {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Briefcase className="size-5 text-[#7c3aed]" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c3aed]">
              Career
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Work Experience
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]" />
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative"
        >
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px timeline-line" />

          <div className="space-y-10">
            {experiences.map((exp) => (
              <motion.div
                key={exp.id}
                variants={itemVariants}
                className="relative flex gap-6 pl-16"
              >
                {/* Timeline dot */}
                <div className="absolute left-[15px] top-5 size-[18px] rounded-full border-2 border-[#7c3aed] bg-background flex items-center justify-center">
                  <div className="size-2 rounded-full bg-[#7c3aed]" />
                </div>

                {/* Card */}
                <div className="glass glass-hover glow-hover flex-1 p-6 rounded-xl">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-foreground leading-tight">
                        {exp.company}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="bg-[#7c3aed]/15 text-[#a78bfa] border border-[#7c3aed]/20 text-xs"
                        >
                          {exp.role}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs border-white/10 text-muted-foreground"
                        >
                          {exp.type}
                        </Badge>
                        {exp.isCurrent && (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        <span>
                          {exp.startDate} &mdash;{" "}
                          {exp.isCurrent ? "Present" : exp.endDate ?? "—"}
                        </span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3.5" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}

            {experiences.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                No experience entries yet.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
