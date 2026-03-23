import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ExperienceForm } from "@/components/admin/experience-form";

export default function NewExperiencePage() {
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
        <h1 className="text-2xl font-bold text-white">Add Experience</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Create a new experience entry
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <ExperienceForm />
      </div>
    </div>
  );
}
