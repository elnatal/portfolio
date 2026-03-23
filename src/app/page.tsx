import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/portfolio/hero-section";
import { ExperienceSection } from "@/components/portfolio/experience-section";
import { ProjectsSection } from "@/components/portfolio/projects-section";
import { SkillsSection } from "@/components/portfolio/skills-section";
import { EducationSection } from "@/components/portfolio/education-section";
import { CertificationsSection } from "@/components/portfolio/certifications-section";
import { LanguagesSection } from "@/components/portfolio/languages-section";
import { ContactSection } from "@/components/portfolio/contact-section";

export default async function HomePage() {
  const [personalInfo, experiences, projects, skills, education, certifications, languages] = await Promise.all([
    prisma.personalInfo.findFirst(),
    prisma.experience.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    prisma.project.findMany({ where: { visible: true }, orderBy: [{ featured: "desc" }, { order: "asc" }] }),
    prisma.skill.findMany({ where: { visible: true }, orderBy: [{ category: "asc" }, { order: "asc" }] }),
    prisma.education.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    prisma.certification.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    prisma.language.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection info={personalInfo} />
      <ExperienceSection experiences={experiences} />
      <ProjectsSection projects={projects} />
      <SkillsSection skills={skills} />
      <EducationSection education={education} />
      <CertificationsSection certifications={certifications} />
      <LanguagesSection languages={languages} />
      <ContactSection />
    </main>
  );
}
