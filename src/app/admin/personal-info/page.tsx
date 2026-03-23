import { prisma } from "@/lib/prisma";
import { PersonalInfoForm } from "@/components/admin/personal-info-form";

export default async function PersonalInfoPage() {
  const info = await prisma.personalInfo.findFirst();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Personal Info</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Manage your portfolio&apos;s personal information
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <PersonalInfoForm
          info={
            info
              ? {
                  ...info,
                  bio: info.bio ?? "",
                  phone: info.phone ?? "",
                  website: info.website ?? "",
                  location: info.location ?? "",
                  github: info.github ?? "",
                  linkedin: info.linkedin ?? "",
                  twitter: info.twitter ?? "",
                }
              : null
          }
        />
      </div>
    </div>
  );
}
