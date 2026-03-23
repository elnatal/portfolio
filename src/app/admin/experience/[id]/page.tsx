import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ExperienceForm } from "@/components/admin/experience-form";

interface EditExperiencePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExperiencePage({
  params,
}: EditExperiencePageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (isNaN(id)) notFound();

  const experience = await prisma.experience.findUnique({ where: { id } });
  if (!experience) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/experience"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Experience
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit Experience</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Update details for{" "}
          <span className="text-violet-400">{experience.company}</span>
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <ExperienceForm
          experience={{
            ...experience,
            type: experience.type as
              | "Full-time"
              | "Freelance"
              | "Contract"
              | "Internship",
            endDate: experience.endDate ?? "",
            location: experience.location ?? "",
            description: experience.description ?? "",
          }}
        />
      </div>
    </div>
  );
}
