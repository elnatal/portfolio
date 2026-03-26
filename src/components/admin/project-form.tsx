"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

interface ProjectFormData {
  name: string;
  slug: string;
  summary: string;
  description: string;
  tags: string;
  liveUrl: string;
  githubUrl: string;
  images: string[];
  featured: boolean;
  visible: boolean;
  order: number;
}

interface Project {
  id: number;
  name: string;
  slug: string;
  summary: string | null;
  description: string | null;
  tags: string;
  liveUrl: string | null;
  githubUrl: string | null;
  images: string;
  featured: boolean;
  visible: boolean;
  order: number;
}

interface ProjectFormProps {
  project?: Project;
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!project;

  const parsedTags = (() => {
    if (!project?.tags) return "";
    try {
      const arr = JSON.parse(project.tags);
      return Array.isArray(arr) ? arr.join(", ") : project.tags;
    } catch {
      return project.tags;
    }
  })();

  const parsedImages = (() => {
    if (!project?.images) return [];
    try {
      const arr = JSON.parse(project.images);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  })();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    defaultValues: {
      name: project?.name ?? "",
      slug: project?.slug ?? "",
      summary: project?.summary ?? "",
      description: project?.description ?? "",
      tags: parsedTags,
      liveUrl: project?.liveUrl ?? "",
      githubUrl: project?.githubUrl ?? "",
      images: parsedImages,
      featured: project?.featured ?? false,
      visible: project?.visible ?? true,
      order: project?.order ?? 0,
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    const tagsArray = data.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...data,
      slug: data.slug.trim() || undefined,
      summary: data.summary || null,
      tags: JSON.stringify(tagsArray),
      order: Number(data.order),
      liveUrl: data.liveUrl || null,
      githubUrl: data.githubUrl || null,
      images: JSON.stringify(data.images),
    };

    try {
      const url = isEditing ? `/api/projects/${project.id}` : "/api/projects";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Something went wrong");
      }

      toast.success(
        isEditing ? "Project updated successfully" : "Project created successfully"
      );
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-gray-300">
          Project Name <span className="text-red-400">*</span>
        </Label>
        <Input
          id="name"
          {...register("name", { required: "Name is required" })}
          placeholder="My Awesome Project"
          className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
        {errors.name && (
          <p className="text-red-400 text-xs">{errors.name.message}</p>
        )}
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <Label htmlFor="slug" className="text-gray-300">
          URL Slug
          <span className="text-gray-500 text-xs font-normal ml-2">
            — leave blank to auto-generate from name
          </span>
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm shrink-0">/projects/</span>
          <Input
            id="slug"
            {...register("slug")}
            placeholder="my-cool-project"
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-1.5">
        <Label htmlFor="summary" className="text-gray-300">
          Short Summary
          <span className="text-gray-500 text-xs font-normal ml-2">
            — shown at the top of the detail page and on cards
          </span>
        </Label>
        <Textarea
          id="summary"
          {...register("summary")}
          placeholder="One or two sentences that capture what this project does and why it matters."
          rows={3}
          className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500 resize-none"
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label className="text-gray-300">
          Full Description
          <span className="text-gray-500 text-xs font-normal ml-2">
            — rich text shown on the detail page
          </span>
        </Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <Label htmlFor="tags" className="text-gray-300">
          Tags{" "}
          <span className="text-gray-500 text-xs font-normal">(comma-separated)</span>
        </Label>
        <Input
          id="tags"
          {...register("tags")}
          placeholder="React, TypeScript, Tailwind"
          className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="liveUrl" className="text-gray-300">Live URL</Label>
          <Input
            id="liveUrl"
            {...register("liveUrl")}
            placeholder="https://example.com"
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="githubUrl" className="text-gray-300">GitHub URL</Label>
          <Input
            id="githubUrl"
            {...register("githubUrl")}
            placeholder="https://github.com/user/repo"
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-1.5">
        <Label className="text-gray-300">
          Project Images
          <span className="text-gray-500 text-xs font-normal ml-2">— first image is the cover</span>
        </Label>
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <MultiImageUpload value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      {/* Featured */}
      <div className="flex items-center gap-3">
        <Controller
          name="featured"
          control={control}
          render={({ field }) => (
            <Switch
              id="featured"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="featured" className="text-gray-300 cursor-pointer">
          Featured project
        </Label>
      </div>

      {/* Visible */}
      <div className="flex items-center gap-3">
        <Controller
          name="visible"
          control={control}
          render={({ field }) => (
            <Switch
              id="visible"
              checked={field.value}
              onCheckedChange={field.onChange}
              className={field.value ? "bg-emerald-500" : undefined}
            />
          )}
        />
        <Label htmlFor="visible" className="text-gray-300 cursor-pointer">
          Show on portfolio &amp; CV
        </Label>
      </div>

      {/* Order */}
      <div className="space-y-1.5 max-w-xs">
        <Label htmlFor="order" className="text-gray-300">Display Order</Label>
        <Input
          id="order"
          type="number"
          {...register("order")}
          placeholder="0"
          className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
        </Button>
        <Button asChild variant="ghost" className="text-gray-400 hover:text-white">
          <Link href="/admin/projects">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
