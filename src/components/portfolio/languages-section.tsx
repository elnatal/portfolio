"use client";

import { motion } from "framer-motion";
import { Languages } from "lucide-react";

type Language = {
  id: number;
  name: string;
  isMother: boolean;
  listening: string | null;
  reading: string | null;
  writing: string | null;
  spokenProduction: string | null;
  spokenInteraction: string | null;
};

const CEFR_COLOR: Record<string, string> = {
  A1: "text-gray-400",
  A2: "text-gray-300",
  B1: "text-sky-400",
  B2: "text-sky-300",
  C1: "text-violet-400",
  C2: "text-violet-300",
};

function LevelBadge({ level }: { level: string | null }) {
  if (!level) return <span className="text-gray-600">—</span>;
  return (
    <span className={`font-bold text-sm tabular-nums ${CEFR_COLOR[level] ?? "text-gray-300"}`}>
      {level}
    </span>
  );
}

export function LanguagesSection({ languages }: { languages: Language[] }) {
  if (languages.length === 0) return null;

  const motherTongues = languages.filter((l) => l.isMother);
  const others = languages.filter((l) => !l.isMother);

  return (
    <section id="languages" className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Languages className="size-5 text-[#7c3aed]" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c3aed]">
              Communication
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Languages
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-2xl p-6 sm:p-8 space-y-8"
        >
          {/* Mother tongue row */}
          {motherTongues.length > 0 && (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Mother tongue{motherTongues.length > 1 ? "s" : ""}:
              </span>
              <span className="text-base font-semibold text-foreground">
                {motherTongues.map((l) => l.name).join(", ")}
              </span>
            </div>
          )}

          {/* Other languages */}
          {others.length > 0 && (
            <div className="space-y-6">
              {motherTongues.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Other language{others.length > 1 ? "s" : ""}:
                </p>
              )}

              {others.map((lang, i) => (
                <motion.div
                  key={lang.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="space-y-3"
                >
                  {/* Language name */}
                  <h3 className="text-base font-bold text-foreground">{lang.name}</h3>

                  {/* Skills grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {[
                      { label: "Listening",          value: lang.listening },
                      { label: "Reading",            value: lang.reading },
                      { label: "Writing",            value: lang.writing },
                      { label: "Spoken Production",  value: lang.spokenProduction },
                      { label: "Spoken Interaction", value: lang.spokenInteraction },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="bg-white/4 border border-white/8 rounded-lg px-3 py-2.5 flex flex-col items-center gap-1 text-center"
                      >
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {label}
                        </span>
                        <LevelBadge level={value} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* CEFR legend */}
              <p className="text-xs text-gray-600 pt-2 border-t border-white/5">
                Levels: A1–A2 Basic user &nbsp;·&nbsp; B1–B2 Independent user &nbsp;·&nbsp; C1–C2 Proficient user
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
