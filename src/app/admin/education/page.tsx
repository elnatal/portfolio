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
import { DeleteButton } from "@/components/admin/delete-button";

export default async function EducationPage() {
  const education = await prisma.education.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Education</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {education.length} entries total
          </p>
        </div>
        <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
          <Link href="/admin/education/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-400">Institution</TableHead>
              <TableHead className="text-gray-400">Degree</TableHead>
              <TableHead className="text-gray-400">Field</TableHead>
              <TableHead className="text-gray-400">Years</TableHead>
              <TableHead className="text-gray-400 text-center">Visible</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {education.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell
                  colSpan={5}
                  className="text-center text-gray-500 py-8"
                >
                  No education entries yet.{" "}
                  <Link
                    href="/admin/education/new"
                    className="text-violet-400 hover:underline"
                  >
                    Add one
                  </Link>
                </TableCell>
              </TableRow>
            )}
            {education.map((edu) => (
              <TableRow
                key={edu.id}
                className="border-white/10 hover:bg-white/5"
              >
                <TableCell className="text-white font-medium">
                  {edu.institution}
                </TableCell>
                <TableCell className="text-gray-300">{edu.degree}</TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {edu.field}
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {edu.startYear}
                  {" — "}
                  {edu.isCurrent ? (
                    <span className="text-emerald-400">Present</span>
                  ) : (
                    edu.endYear ?? "—"
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <VisibilityToggle id={edu.id} visible={edu.visible} endpoint="/api/education" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <Link href={`/admin/education/${edu.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <DeleteButton
                      endpoint={`/api/education/${edu.id}`}
                      label="education entry"
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
