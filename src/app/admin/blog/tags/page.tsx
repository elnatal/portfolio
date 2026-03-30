"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BlogTag {
  id: number;
  name: string;
  slug: string;
  visible: boolean;
  _count: { posts: number };
}

export default function AdminBlogTagsPage() {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const fetchTags = async () => {
    const res = await fetch("/api/blog/tags");
    if (res.ok) setTags(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchTags(); }, []);

  const addTag = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/blog/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setNewName("");
      toast.success("Tag created");
      fetchTags();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create tag");
    } finally {
      setAdding(false);
    }
  };

  const saveEdit = async (id: number) => {
    try {
      const res = await fetch(`/api/blog/tags/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Tag updated");
      setEditId(null);
      fetchTags();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update tag");
    }
  };

  const deleteTag = async (id: number, name: string) => {
    if (!confirm(`Delete tag "${name}"? This will remove it from all posts.`)) return;
    try {
      const res = await fetch(`/api/blog/tags/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Tag deleted");
      fetchTags();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete tag");
    }
  };

  const inputCls = "bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500 h-8 text-sm";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Blog Tags</h1>
        <p className="text-gray-400 mt-1 text-sm">{tags.length} tags total</p>
      </div>

      {/* Add new tag inline */}
      <div className="flex items-center gap-2 max-w-sm">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTag()}
          placeholder="New tag name..."
          className={inputCls}
        />
        <Button
          onClick={addTag}
          disabled={adding || !newName.trim()}
          size="sm"
          className="bg-violet-600 hover:bg-violet-700 text-white shrink-0"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Slug</TableHead>
              <TableHead className="text-gray-400">Posts</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow className="border-white/10">
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">Loading...</TableCell>
              </TableRow>
            )}
            {!loading && tags.length === 0 && (
              <TableRow className="border-white/10">
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">No tags yet.</TableCell>
              </TableRow>
            )}
            {tags.map((tag) => (
              <TableRow key={tag.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="text-white font-medium">
                  {editId === tag.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveEdit(tag.id); if (e.key === "Escape") setEditId(null); }}
                      className={inputCls}
                      autoFocus
                    />
                  ) : (
                    tag.name
                  )}
                </TableCell>
                <TableCell className="text-gray-400 text-sm font-mono">{tag.slug}</TableCell>
                <TableCell className="text-gray-400 text-sm">{tag._count.posts}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {editId === tag.id ? (
                      <>
                        <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300" onClick={() => saveEdit(tag.id)}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" onClick={() => setEditId(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                          onClick={() => { setEditId(tag.id); setEditName(tag.name); }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-red-400"
                          onClick={() => deleteTag(tag.id, tag.name)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
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
