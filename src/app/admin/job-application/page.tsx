import { JobApplicationGenerator } from "@/components/admin/job-application-generator";

export default function JobApplicationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Job Application Generator</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Generate cover letters, application letters, emails, and Q&amp;A answers from a job description
        </p>
      </div>
      <JobApplicationGenerator />
    </div>
  );
}
