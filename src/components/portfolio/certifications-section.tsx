"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Award, ExternalLink, CalendarDays } from "lucide-react";

type Certification = {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  imageUrl: string | null;
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function CertificationsSection({
  certifications,
}: {
  certifications: Certification[];
}) {
  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="py-24 px-4 sm:px-6">
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
            <Award className="size-5 text-[#7c3aed]" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7c3aed]">
              Credentials
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Certifications
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa]" />
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {certifications.map((cert) => (
            <motion.div key={cert.id} variants={itemVariants}>
              <div className="glass glass-hover glow-hover h-full p-5 rounded-xl flex flex-col gap-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-[#7c3aed]/20 border border-[#7c3aed]/30 overflow-hidden">
                      {cert.imageUrl ? (
                        <Image
                          src={cert.imageUrl}
                          alt={cert.issuer}
                          width={36}
                          height={36}
                          className="w-full h-full object-contain p-0.5"
                        />
                      ) : (
                        <Award className="size-4 text-[#a78bfa]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-foreground leading-tight truncate">
                        {cert.name}
                      </h3>
                      <p className="text-xs text-[#a78bfa] mt-0.5">{cert.issuer}</p>
                    </div>
                  </div>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-gray-500 hover:text-violet-400 transition-colors"
                      title="Verify credential"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </div>

                {/* Date row */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="size-3 shrink-0" />
                  <span>
                    {cert.issueDate}
                    {cert.expiryDate ? ` — ${cert.expiryDate}` : " · No Expiry"}
                  </span>
                </div>

                {/* Credential ID */}
                {cert.credentialId && (
                  <p className="text-xs text-gray-500 font-mono">
                    ID: {cert.credentialId}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
