"use client";

import { useState, useEffect, createElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Download, Loader2, Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Certifications", href: "#certifications" },
  { label: "Languages", href: "#languages" },
  { label: "Contact", href: "#contact" },
  { label: "Blog", href: "/blog" },
];

function fileDate() {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

async function downloadCV() {
  const [{ pdf }, { CVDocument }, res] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/lib/cv-pdf"),
    fetch("/api/cv-data"),
  ]);

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = await pdf(createElement(CVDocument, { data }) as any).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.info.name.toLowerCase().replace(/\s+/g, "-")}-cv-${fileDate()}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

async function downloadResume() {
  const [{ pdf }, { ResumeDocument }, res] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/lib/resume-pdf"),
    fetch("/api/cv-data"),
  ]);

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blob = await pdf(createElement(ResumeDocument, { data }) as any).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.info.name.toLowerCase().replace(/\s+/g, "-")}-resume-${fileDate()}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);

  async function handleDownloadCV() {
    setCvLoading(true);
    try {
      await downloadCV();
    } finally {
      setCvLoading(false);
    }
  }

  async function handleDownloadResume() {
    setResumeLoading(true);
    try {
      await downloadResume();
    } finally {
      setResumeLoading(false);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll spy — only for hash links
      const sections = navLinks.filter((l) => l.href.startsWith("#")).map((l) => l.href.slice(1));
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          current = id;
        }
      }
      setActive(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#about"
          className="font-bold text-lg gradient-text hover:opacity-90 transition-opacity"
        >
          ED.
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isPage = link.href.startsWith("/");
            const isActive = isPage
              ? pathname.startsWith(link.href)
              : active === link.href.slice(1);
            const cls = cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            );
            return (
              <li key={link.href}>
                {isPage ? (
                  <Link href={link.href} className={cls}>{link.label}</Link>
                ) : (
                  <a href={link.href} className={cls}>{link.label}</a>
                )}
              </li>
            );
          })}
        </ul>

        {/* Download buttons — desktop */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={handleDownloadResume}
            disabled={resumeLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-[#a78bfa] hover:bg-secondary transition-all duration-200 disabled:opacity-50"
          >
            {resumeLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            Resume
          </button>
          <button
            onClick={handleDownloadCV}
            disabled={cvLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-[#a78bfa] hover:bg-secondary transition-all duration-200 disabled:opacity-50"
          >
            {cvLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            CV
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg">
          <ul className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isPage = link.href.startsWith("/");
              const isActive = isPage
                ? pathname.startsWith(link.href)
                : active === link.href.slice(1);
              const cls = cn(
                "block px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              );
              return (
                <li key={link.href}>
                  {isPage ? (
                    <Link href={link.href} className={cls} onClick={() => setMenuOpen(false)}>
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className={cls} onClick={() => setMenuOpen(false)}>
                      {link.label}
                    </a>
                  )}
                </li>
              );
            })}
            <li className="flex gap-2 pt-1 border-t border-border mt-1">
              <button
                onClick={() => { handleDownloadResume(); setMenuOpen(false); }}
                disabled={resumeLoading}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-[#a78bfa] hover:bg-secondary transition-all duration-200 disabled:opacity-50"
              >
                {resumeLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                Resume
              </button>
              <button
                onClick={() => { handleDownloadCV(); setMenuOpen(false); }}
                disabled={cvLoading}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-[#a78bfa] hover:bg-secondary transition-all duration-200 disabled:opacity-50"
              >
                {cvLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                CV
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
