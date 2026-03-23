import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EducationForm } from "@/components/admin/education-form";

interface EditEducationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEducationPage({
  params,
}: EditEducationPageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (isNaN(id)) notFound();

  const education = await prisma.education.findUnique({ where: { id } });
  if (!education) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/education"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Education
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit Education</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Update details for{" "}
          <span className="text-violet-400">{education.institution}</span>
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <EducationForm
          education={{
            ...education,
            endYear: education.endYear ?? null,
            description: education.description ?? null,
          }}
        />
      </div>
    </div>
  );
}
