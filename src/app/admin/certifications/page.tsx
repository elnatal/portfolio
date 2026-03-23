import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Pencil, ExternalLink } from "lucide-react";
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

export default async function CertificationsPage() {
  const certifications = await prisma.certification.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Certifications</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {certifications.length} entries total
          </p>
        </div>
        <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
          <Link href="/admin/certifications/new">
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
              <TableHead className="text-gray-400">Issuer</TableHead>
              <TableHead className="text-gray-400">Issue Date</TableHead>
              <TableHead className="text-gray-400">Expiry</TableHead>
              <TableHead className="text-gray-400 text-center">Visible</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certifications.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No certifications yet.{" "}
                  <Link href="/admin/certifications/new" className="text-violet-400 hover:underline">
                    Add one
                  </Link>
                </TableCell>
              </TableRow>
            )}
            {certifications.map((cert) => (
              <TableRow key={cert.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="text-white font-medium">
                  <div className="flex items-center gap-2">
                    {cert.name}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-violet-400"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">{cert.issuer}</TableCell>
                <TableCell className="text-gray-400 text-sm">{cert.issueDate}</TableCell>
                <TableCell className="text-gray-400 text-sm">
                  {cert.expiryDate ?? <span className="text-emerald-400 text-xs">No Expiry</span>}
                </TableCell>
                <TableCell className="text-center">
                  <VisibilityToggle id={cert.id} visible={cert.visible} endpoint="/api/certifications" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <Link href={`/admin/certifications/${cert.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <DeleteButton
                      endpoint={`/api/certifications/${cert.id}`}
                      label="certification"
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
