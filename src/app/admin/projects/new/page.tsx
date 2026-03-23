import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-white">Add Project</h1>
        <p className="text-gray-400 mt-1 text-sm">Create a new project entry</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <ProjectForm />
      </div>
    </div>
  );
}
