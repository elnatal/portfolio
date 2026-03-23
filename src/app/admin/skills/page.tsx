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

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Skills</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {skills.length} skills total
          </p>
        </div>
        <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
          <Link href="/admin/skills/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Category</TableHead>
              <TableHead className="text-gray-400">Order</TableHead>
              <TableHead className="text-gray-400 text-center">Visible</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-500 py-8"
                >
                  No skills yet.{" "}
                  <Link
                    href="/admin/skills/new"
                    className="text-violet-400 hover:underline"
                  >
                    Add one
                  </Link>
                </TableCell>
              </TableRow>
            )}
            {skills.map((skill) => (
              <TableRow
                key={skill.id}
                className="border-white/10 hover:bg-white/5"
              >
                <TableCell className="text-white font-medium">
                  {skill.name}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="border-blue-500/40 text-blue-300 text-xs"
                  >
                    {skill.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {skill.order}
                </TableCell>
                <TableCell className="text-center">
                  <VisibilityToggle id={skill.id} visible={skill.visible} endpoint="/api/skills" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <Link href={`/admin/skills/${skill.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <DeleteButton
                      endpoint={`/api/skills/${skill.id}`}
                      label="skill"
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
