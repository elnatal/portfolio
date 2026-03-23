import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Pencil } from "lucide-react";
import { VisibilityToggle } from "@/components/admin/visibility-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function LanguagesPage() {
  const languages = await prisma.language.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Languages</h1>
          <p className="text-gray-400 mt-1 text-sm">{languages.length} entries total</p>
        </div>
        <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
          <Link href="/admin/languages/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-400">Language</TableHead>
              <TableHead className="text-gray-400">Type</TableHead>
              <TableHead className="text-gray-400">Listening</TableHead>
              <TableHead className="text-gray-400">Reading</TableHead>
              <TableHead className="text-gray-400">Writing</TableHead>
              <TableHead className="text-gray-400">Spoken Prod.</TableHead>
              <TableHead className="text-gray-400">Spoken Int.</TableHead>
              <TableHead className="text-gray-400 text-center">Visible</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {languages.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                  No languages yet.{" "}
                  <Link href="/admin/languages/new" className="text-violet-400 hover:underline">
                    Add one
                  </Link>
                </TableCell>
              </TableRow>
            )}
            {languages.map((lang) => (
              <TableRow key={lang.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="text-white font-medium">{lang.name}</TableCell>
                <TableCell>
                  {lang.isMother ? (
                    <Badge variant="outline" className="border-violet-500/40 text-violet-300">Mother tongue</Badge>
                  ) : (
                    <Badge variant="outline" className="border-white/20 text-gray-400">Other</Badge>
                  )}
                </TableCell>
                {(["listening", "reading", "writing", "spokenProduction", "spokenInteraction"] as const).map((k) => (
                  <TableCell key={k} className="text-gray-300 text-sm">
                    {lang.isMother ? "—" : (lang[k] ?? "—")}
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  <VisibilityToggle id={lang.id} visible={lang.visible} endpoint="/api/languages" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button asChild variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Link href={`/admin/languages/${lang.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <DeleteButton endpoint={`/api/languages/${lang.id}`} label="language" />
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
