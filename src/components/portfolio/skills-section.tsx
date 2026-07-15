"use client";

import { motion, type Variants } from "framer-motion";
import { Code, Layers, Database, Server, Cpu } from "lucide-react";

type Skill = {
  id: number;
  name: string;
  category: string;
  order: number;
};

type CategoryConfig = {
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
};

// One accent color for every category — differentiate by icon/label, not hue.
const categoryConfig: Record<string, CategoryConfig> = {
  Languages: {
    label: "Languages",
    icon: <Code className="size-5" />,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
  },
  Frameworks: {
    label: "Frameworks",
    icon: <Layers className="size-5" />,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
  },
  Databases: {
    label: "Databases",
    icon: <Database className="size-5" />,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
  },
  DevOps: {
    label: "DevOps & Tools",
    icon: <Server className="size-5" />,
    color: "text-primary",
    bgColor: "bg-primary/10 border-primary/20",
  },
};

function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});
}

// Ordered category list so the grid is predictable
const categoryOrder = ["Languages", "Frameworks", "Databases", "DevOps"];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const grouped = groupByCategory(skills);

  // Build ordered categories array, including any extra categories from DB
  const allCategories = [
    ...categoryOrder,
    ...Object.keys(grouped).filter((k) => !categoryOrder.includes(k)),
  ].filter((cat) => grouped[cat]?.length);

  return (
    <section id="skills" className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Cpu className="size-5 text-primary" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Expertise
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Skills & Technologies
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-primary" />
        </motion.div>

        {/* 2x2 grid of category panels */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {allCategories.map((cat) => {
            const config = categoryConfig[cat] ?? {
              label: cat,
              icon: <Code className="size-5" />,
              color: "text-primary",
              bgColor: "bg-primary/10 border-primary/20",
            };
            const catSkills = grouped[cat] ?? [];

            return (
              <motion.div
                key={cat}
                variants={panelVariants}
                className="glass glass-hover glow-hover rounded-xl p-6"
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className={`flex items-center justify-center size-9 rounded-lg border ${config.bgColor} ${config.color}`}
                  >
                    {config.icon}
                  </div>
                  <h3 className={`font-semibold text-base ${config.color}`}>
                    {config.label}
                  </h3>
                </div>

                {/* Skill badges */}
                <div className="flex flex-wrap gap-2">
                  {catSkills.map((skill) => (
                    <motion.span
                      key={skill.id}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.15 }}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-foreground/5 border border-foreground/8 text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-default"
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {skills.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            No skills listed yet.
          </p>
        )}
      </div>
    </section>
  );
}
