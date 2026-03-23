import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { LanguageForm } from "@/components/admin/language-form";

interface EditLanguagePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLanguagePage({ params }: EditLanguagePageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (isNaN(id)) notFound();

  const language = await prisma.language.findUnique({ where: { id } });
  if (!language) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/languages"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Languages
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit Language</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Update details for <span className="text-violet-400">{language.name}</span>
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <LanguageForm language={language} />
      </div>
    </div>
  );
}
