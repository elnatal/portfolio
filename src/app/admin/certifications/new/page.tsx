import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CertificationForm } from "@/components/admin/certification-form";

export default function NewCertificationPage() {
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
        <h1 className="text-2xl font-bold text-white">Add Certification</h1>
        <p className="text-gray-400 mt-1 text-sm">Create a new certification entry</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <CertificationForm />
      </div>
    </div>
  );
}
