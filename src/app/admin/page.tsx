import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Briefcase, FolderOpen, Code, Mail, GraduationCap, User, ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  const [experienceCount, projectsCount, skillsCount, unreadMessages] =
    await Promise.all([
      prisma.experience.count(),
      prisma.project.count(),
      prisma.skill.count(),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);

  const stats = [
    {
      label: "Experience Entries",
      value: experienceCount,
      icon: Briefcase,
      href: "/admin/experience",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      label: "Projects",
      value: projectsCount,
      icon: FolderOpen,
      href: "/admin/projects",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Skills",
      value: skillsCount,
      icon: Code,
      href: "/admin/skills",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Unread Messages",
      value: unreadMessages,
      icon: Mail,
      href: "/admin/messages",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  const quickLinks = [
    { label: "Manage Experience", href: "/admin/experience", icon: Briefcase },
    { label: "Manage Projects", href: "/admin/projects", icon: FolderOpen },
    { label: "Manage Skills", href: "/admin/skills", icon: Code },
    { label: "Manage Education", href: "/admin/education", icon: GraduationCap },
    { label: "Personal Info", href: "/admin/personal-info", icon: User },
    { label: "View Messages", href: "/admin/messages", icon: Mail },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Overview of your portfolio content
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href, color, bg, border }) => (
          <Link
            key={href}
            href={href}
            className={`group relative rounded-xl border ${border} ${bg} backdrop-blur-sm p-5 hover:scale-[1.02] transition-all duration-200`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{label}</p>
                <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
              </div>
              <div className={`p-2 rounded-lg ${bg} border ${border}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-violet-500/30 transition-all duration-150 group"
            >
              <Icon className="w-4 h-4 text-gray-500 group-hover:text-violet-400 transition-colors" />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {label}
              </span>
              <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-violet-400 ml-auto transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
