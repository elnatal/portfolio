"use client";

import { motion, type Variants } from "framer-motion";
import { GraduationCap, BookOpen } from "lucide-react";

type Education = {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string | null;
  isCurrent: boolean;
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export function EducationSection({ education }: { education: Education[] }) {
  return (
    <section id="education" className="py-24 px-4 sm:px-6">
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
            <BookOpen className="size-5 text-[#7c3aed]" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c3aed]">
              Background
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Education
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

          <div className="space-y-8">
            {education.map((edu) => (
              <motion.div
                key={edu.id}
                variants={itemVariants}
                className="relative flex gap-6 pl-16"
              >
                {/* Timeline dot */}
                <div className="absolute left-[15px] top-5 size-[18px] rounded-full border-2 border-[#7c3aed] bg-background flex items-center justify-center">
                  <GraduationCap className="size-2.5 text-[#7c3aed]" />
                </div>

                {/* Card */}
                <div className="glass glass-hover glow-hover flex-1 p-6 rounded-xl">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Institution */}
                      <h3 className="text-base font-bold text-foreground leading-tight mb-1">
                        {edu.institution}
                      </h3>

                      {/* Degree + field */}
                      <p className="text-sm font-medium text-[#a78bfa]">
                        {edu.degree}
                        {edu.field ? ` — ${edu.field}` : ""}
                      </p>
                    </div>

                    {/* Year range */}
                    <div className="shrink-0 text-xs text-muted-foreground bg-white/4 border border-white/8 rounded-lg px-3 py-1.5 font-medium tabular-nums">
                      {edu.startYear} &mdash;{" "}
                      {edu.isCurrent
                        ? "Present"
                        : edu.endYear ?? "—"}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {education.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                No education entries yet.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
