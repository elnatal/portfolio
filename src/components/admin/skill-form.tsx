"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SkillCategory = "Languages" | "Frameworks" | "Databases" | "DevOps";

interface SkillFormData {
  name: string;
  category: SkillCategory;
  order: number;
  visible: boolean;
}

interface Skill extends SkillFormData {
  id: number;
}

interface SkillFormProps {
  skill?: Skill;
}

export function SkillForm({ skill }: SkillFormProps) {
  const router = useRouter();
  const isEditing = !!skill;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormData>({
    defaultValues: {
      name: skill?.name ?? "",
      category: skill?.category ?? "Languages",
      order: skill?.order ?? 0,
      visible: skill?.visible ?? true,
    },
  });

  const categoryValue = watch("category");

  const onSubmit = async (data: SkillFormData) => {
    const payload = { ...data, order: Number(data.order) };

    try {
      const url = isEditing ? `/api/skills/${skill.id}` : "/api/skills";
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
        isEditing ? "Skill updated successfully" : "Skill created successfully"
      );
      router.push("/admin/skills");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-gray-300">
          Skill Name <span className="text-red-400">*</span>
        </Label>
        <Input
          id="name"
          {...register("name", { required: "Skill name is required" })}
          placeholder="TypeScript"
          className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
        {errors.name && (
          <p className="text-red-400 text-xs">{errors.name.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label className="text-gray-300">Category</Label>
        <Select
          value={categoryValue}
          onValueChange={(val) => setValue("category", val as SkillCategory)}
        >
          <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-violet-500">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-white/10 text-white">
            <SelectItem value="Languages">Languages</SelectItem>
            <SelectItem value="Frameworks">Frameworks</SelectItem>
            <SelectItem value="Databases">Databases</SelectItem>
            <SelectItem value="DevOps">DevOps</SelectItem>
          </SelectContent>
        </Select>
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
      <div className="space-y-1.5">
        <Label htmlFor="order" className="text-gray-300">
          Display Order
        </Label>
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
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Skill"
            : "Create Skill"}
        </Button>
        <Button
          asChild
          variant="ghost"
          className="text-gray-400 hover:text-white"
        >
          <Link href="/admin/skills">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
