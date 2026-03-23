import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SkillForm } from "@/components/admin/skill-form";

export default function NewSkillPage() {
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
        <h1 className="text-2xl font-bold text-white">Add Skill</h1>
        <p className="text-gray-400 mt-1 text-sm">Create a new skill entry</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <SkillForm />
      </div>
    </div>
  );
}
