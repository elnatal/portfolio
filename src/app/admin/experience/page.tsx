import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Pencil } from "lucide-react";
import { VisibilityToggle } from "@/components/admin/visibility-toggle";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function ExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Experience</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {experiences.length} entries total
          </p>
        </div>
        <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
          <Link href="/admin/experience/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-400">Company</TableHead>
              <TableHead className="text-gray-400">Role</TableHead>
              <TableHead className="text-gray-400">Type</TableHead>
              <TableHead className="text-gray-400">Dates</TableHead>
              <TableHead className="text-gray-400">Location</TableHead>
              <TableHead className="text-gray-400 text-center">Visible</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-500 py-8"
                >
                  No experience entries yet.{" "}
                  <Link
                    href="/admin/experience/new"
                    className="text-violet-400 hover:underline"
                  >
                    Add one
                  </Link>
                </TableCell>
              </TableRow>
            )}
            {experiences.map((exp) => (
              <TableRow
                key={exp.id}
                className="border-white/10 hover:bg-white/5"
              >
                <TableCell className="text-white font-medium">
                  {exp.company}
                </TableCell>
                <TableCell className="text-gray-300">{exp.role}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-violet-500/40 text-violet-300 text-xs"
                  >
                    {exp.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {exp.startDate}
                  {" — "}
                  {exp.isCurrent ? (
                    <span className="text-emerald-400">Present</span>
                  ) : (
                    exp.endDate ?? "—"
                  )}
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {exp.location ?? "—"}
                </TableCell>
                <TableCell className="text-center">
                  <VisibilityToggle id={exp.id} visible={exp.visible} endpoint="/api/experience" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <Link href={`/admin/experience/${exp.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <DeleteButton
                      endpoint={`/api/experience/${exp.id}`}
                      label="experience entry"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
