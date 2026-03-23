import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CertificationForm } from "@/components/admin/certification-form";

interface EditCertificationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCertificationPage({
  params,
}: EditCertificationPageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (isNaN(id)) notFound();

  const certification = await prisma.certification.findUnique({ where: { id } });
  if (!certification) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/certifications"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Certifications
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit Certification</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Update details for{" "}
          <span className="text-violet-400">{certification.name}</span>
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <CertificationForm
          certification={{
            ...certification,
            expiryDate: certification.expiryDate ?? null,
            credentialId: certification.credentialId ?? null,
            credentialUrl: certification.credentialUrl ?? null,
            imageUrl: certification.imageUrl ?? null,
          }}
        />
      </div>
    </div>
  );
}
