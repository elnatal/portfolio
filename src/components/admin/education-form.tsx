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

interface EducationFormData {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  isCurrent: boolean;
  description: string;
  order: number;
  visible: boolean;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string | null;
  isCurrent: boolean;
  description: string | null;
  order: number;
  visible: boolean;
}

interface EducationFormProps {
  education?: Education;
}

export function EducationForm({ education }: EducationFormProps) {
  const router = useRouter();
  const isEditing = !!education;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormData>({
    defaultValues: {
      institution: education?.institution ?? "",
      degree: education?.degree ?? "",
      field: education?.field ?? "",
      startYear: education?.startYear ?? String(new Date().getFullYear()),
      endYear: education?.endYear ?? "",
      isCurrent: education?.isCurrent ?? false,
      description: education?.description ?? "",
      order: education?.order ?? 0,
      visible: education?.visible ?? true,
    },
  });

  const isCurrent = watch("isCurrent");

  const onSubmit = async (data: EducationFormData) => {
    const payload = {
      ...data,
      startYear: data.startYear,
      endYear: data.isCurrent ? null : data.endYear || null,
      order: Number(data.order),
      description: data.description || null,
    };

    try {
      const url = isEditing
        ? `/api/education/${education.id}`
        : "/api/education";
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
        isEditing
          ? "Education updated successfully"
          : "Education created successfully"
      );
      router.push("/admin/education");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Institution */}
      <div className="space-y-1.5">
        <Label htmlFor="institution" className="text-gray-300">
          Institution <span className="text-red-400">*</span>
        </Label>
        <Input
          id="institution"
          {...register("institution", { required: "Institution is required" })}
          placeholder="University of Example"
          className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
        {errors.institution && (
          <p className="text-red-400 text-xs">{errors.institution.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Degree */}
        <div className="space-y-1.5">
          <Label htmlFor="degree" className="text-gray-300">
            Degree <span className="text-red-400">*</span>
          </Label>
          <Input
            id="degree"
            {...register("degree", { required: "Degree is required" })}
            placeholder="Bachelor of Science"
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
          />
          {errors.degree && (
            <p className="text-red-400 text-xs">{errors.degree.message}</p>
          )}
        </div>

        {/* Field */}
        <div className="space-y-1.5">
          <Label htmlFor="field" className="text-gray-300">
            Field of Study <span className="text-red-400">*</span>
          </Label>
          <Input
            id="field"
            {...register("field", { required: "Field is required" })}
            placeholder="Computer Science"
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
          />
          {errors.field && (
            <p className="text-red-400 text-xs">{errors.field.message}</p>
          )}
        </div>

        {/* Start Year */}
        <div className="space-y-1.5">
          <Label htmlFor="startYear" className="text-gray-300">
            Start Year <span className="text-red-400">*</span>
          </Label>
          <Input
            id="startYear"
            type="text"
            {...register("startYear", { required: "Start year is required" })}
            placeholder="2018"
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
          />
          {errors.startYear && (
            <p className="text-red-400 text-xs">{errors.startYear.message}</p>
          )}
        </div>

        {/* End Year */}
        <div className="space-y-1.5">
          <Label htmlFor="endYear" className="text-gray-300">
            End Year
          </Label>
          <Input
            id="endYear"
            type="text"
            {...register("endYear")}
            placeholder="2022"
            disabled={isCurrent}
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500 disabled:opacity-40"
          />
        </div>
      </div>

      {/* Is Current */}
      <div className="flex items-center gap-3">
        <Controller
          name="isCurrent"
          control={control}
          render={({ field }) => (
            <Switch
              id="isCurrent"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="isCurrent" className="text-gray-300 cursor-pointer">
          Currently studying here
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

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-gray-300">
          Description
        </Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Additional details about your studies..."
          rows={3}
          className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500 resize-none"
        />
      </div>

      {/* Order */}
      <div className="space-y-1.5 max-w-xs">
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
            ? "Update Education"
            : "Create Education"}
        </Button>
        <Button
          asChild
          variant="ghost"
          className="text-gray-400 hover:text-white"
        >
          <Link href="/admin/education">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
