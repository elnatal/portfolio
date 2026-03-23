import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SkillForm } from "@/components/admin/skill-form";

interface EditSkillPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (isNaN(id)) notFound();

  const skill = await prisma.skill.findUnique({ where: { id } });
  if (!skill) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/skills"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Skills
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit Skill</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Update{" "}
          <span className="text-violet-400">{skill.name}</span>
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <SkillForm
          skill={{
            ...skill,
            category: skill.category as
              | "Languages"
              | "Frameworks"
              | "Databases"
              | "DevOps",
          }}
        />
      </div>
    </div>
  );
}
