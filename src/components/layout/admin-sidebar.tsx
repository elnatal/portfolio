"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Briefcase,
  FolderOpen,
  Code,
  GraduationCap,
  Award,
  Languages,
  User,
  FileText,
  LogOut,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/skills", label: "Skills", icon: Code },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/languages", label: "Languages", icon: Languages },
  { href: "/admin/personal-info", label: "Personal Info", icon: User },
{ href: "/admin/job-application", label: "Job Generator", icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-gray-950/80 backdrop-blur-xl border-r border-white/10 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6 border-b border-white/10">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-600">
          <span className="text-white font-bold text-sm">E</span>
        </div>
        <span className="text-white font-semibold text-lg tracking-tight">
          ED. <span className="text-violet-400">Admin</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
              isActive(href, exact)
                ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4 shrink-0",
                isActive(href, exact) ? "text-violet-400" : "text-gray-500"
              )}
            />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-150"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-gray-500" />
          View Portfolio
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2.5 h-auto text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-150"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
