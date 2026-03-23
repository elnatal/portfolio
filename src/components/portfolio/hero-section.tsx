"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { Github, Linkedin, Mail, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type PersonalInfo = {
  name: string;
  title: string;
  bio: string;
  email: string;
  github?: string | null;
  linkedin?: string | null;
} | null;

const roles = [
  "Lead Software Engineer",
  "Full-Stack Developer",
  "Go & TypeScript Expert",
  "Microservices Architect",
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function HeroSection({ info }: { info: PersonalInfo }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  const name = info?.name ?? "Elnatal Debebe";
  const bio =
    info?.bio ??
    "Passionate engineer crafting scalable systems and elegant user experiences. I turn complex problems into clean, efficient solutions.";
  const email = info?.email ?? "elnataldebebe@gmail.com";
  const github = info?.github ?? "https://github.com/elnatal";
  const linkedin = info?.linkedin ?? "https://linkedin.com/in/elnatal";

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex < currentRole.length) {
      timeout = setTimeout(() => {
        setDisplayed(currentRole.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, 60);
    } else if (!isDeleting && charIndex === currentRole.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayed(currentRole.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      }, 35);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((r) => (r + 1) % roles.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex]);

  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden"
    >
      {/* Background radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[600px] w-[600px] rounded-full bg-[#7c3aed]/10 blur-[120px]" />
      </div>
      {/* Secondary subtle glow top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 h-[350px] w-[350px] rounded-full bg-[#a78bfa]/6 blur-[90px]"
      />
      {/* Dot grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Diamond accent + name */}
        <motion.div variants={itemVariants} className="mb-4">
          <span className="text-[#7c3aed] text-2xl mr-3 select-none">◆</span>
          <span className="text-sm font-semibold tracking-[0.25em] uppercase text-muted-foreground">
            Portfolio
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="gradient-text text-5xl md:text-7xl font-bold leading-tight mb-4"
        >
          {name}
        </motion.h1>

        {/* Typing effect role */}
        <motion.div
          variants={itemVariants}
          className="h-10 flex items-center justify-center mb-6"
        >
          <span className="text-xl md:text-2xl font-medium text-muted-foreground">
            {displayed}
            <span className="inline-block w-[2px] h-[1.1em] bg-[#7c3aed] ml-0.5 align-middle animate-pulse" />
          </span>
        </motion.div>

        {/* Bio */}
        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed mb-10"
        >
          {bio}
        </motion.p>

        {/* Social buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <a href={github} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-white/10 bg-white/4 hover:bg-white/8 hover:border-[#7c3aed]/40 hover:text-[#a78bfa] transition-all duration-200 glow-hover"
            >
              <Github className="size-4" />
              GitHub
            </Button>
          </a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-white/10 bg-white/4 hover:bg-white/8 hover:border-[#7c3aed]/40 hover:text-[#a78bfa] transition-all duration-200 glow-hover"
            >
              <Linkedin className="size-4" />
              LinkedIn
            </Button>
          </a>
          <a href={`mailto:${email}`}>
            <Button
              size="lg"
              className="gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white border-0 glow-hover"
            >
              <Mail className="size-4" />
              Get In Touch
            </Button>
          </a>
          <a href="/api/cv" download>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-white/10 bg-white/4 hover:bg-white/8 hover:border-[#7c3aed]/40 hover:text-[#a78bfa] transition-all duration-200 glow-hover"
            >
              <Download className="size-4" />
              Download CV
            </Button>
          </a>
        </motion.div>

        {/* Scroll down CTA */}
        <motion.a
          variants={itemVariants}
          href="#experience"
          className="flex flex-col items-center gap-2 text-sm text-muted-foreground hover:text-[#a78bfa] transition-colors duration-200 group"
        >
          <span className="tracking-widest uppercase text-xs font-medium">
            View My Work
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="size-5 group-hover:text-[#7c3aed] transition-colors" />
          </motion.div>
        </motion.a>
      </motion.div>
    </section>
  );
}
