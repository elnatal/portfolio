"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ExperienceType = "Full-time" | "Freelance" | "Contract" | "Internship";

interface ExperienceFormData {
  company: string;
  role: string;
  type: ExperienceType;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location: string;
  description: string;
  order: number;
  visible: boolean;
}

interface Experience extends ExperienceFormData {
  id: number;
}

interface ExperienceFormProps {
  experience?: Experience;
}

export function ExperienceForm({ experience }: ExperienceFormProps) {
  const router = useRouter();
  const isEditing = !!experience;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormData>({
    defaultValues: {
      company: experience?.company ?? "",
      role: experience?.role ?? "",
      type: experience?.type ?? "Full-time",
      startDate: experience?.startDate ?? "",
      endDate: experience?.endDate ?? "",
      isCurrent: experience?.isCurrent ?? false,
      location: experience?.location ?? "",
      description: experience?.description ?? "",
      order: experience?.order ?? 0,
      visible: experience?.visible ?? true,
    },
  });

  const isCurrent = watch("isCurrent");
  const typeValue = watch("type");

  const onSubmit = async (data: ExperienceFormData) => {
    const payload = {
      ...data,
      order: Number(data.order),
      endDate: data.isCurrent ? null : data.endDate || null,
      location: data.location || null,
      description: data.description || null,
    };

    try {
      const url = isEditing
        ? `/api/experience/${experience.id}`
        : "/api/experience";
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
          ? "Experience updated successfully"
          : "Experience created successfully"
      );
      router.push("/admin/experience");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Company */}
        <div className="space-y-1.5">
          <Label htmlFor="company" className="text-gray-300">
            Company <span className="text-red-400">*</span>
          </Label>
          <Input
            id="company"
            {...register("company", { required: "Company is required" })}
            placeholder="Acme Corp"
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
          />
          {errors.company && (
            <p className="text-red-400 text-xs">{errors.company.message}</p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-1.5">
          <Label htmlFor="role" className="text-gray-300">
            Role <span className="text-red-400">*</span>
          </Label>
          <Input
            id="role"
            {...register("role", { required: "Role is required" })}
            placeholder="Senior Engineer"
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
          />
          {errors.role && (
            <p className="text-red-400 text-xs">{errors.role.message}</p>
          )}
        </div>

        {/* Type */}
        <div className="space-y-1.5">
          <Label className="text-gray-300">Type</Label>
          <Select
            value={typeValue}
            onValueChange={(val) => setValue("type", val as ExperienceType)}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-violet-500">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10 text-white">
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Freelance">Freelance</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <Label htmlFor="location" className="text-gray-300">
            Location
          </Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="San Francisco, CA"
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
          />
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <Label htmlFor="startDate" className="text-gray-300">
            Start Date <span className="text-red-400">*</span>
          </Label>
          <Input
            id="startDate"
            {...register("startDate", { required: "Start date is required" })}
            placeholder="Jan 2022"
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
          />
          {errors.startDate && (
            <p className="text-red-400 text-xs">{errors.startDate.message}</p>
          )}
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <Label htmlFor="endDate" className="text-gray-300">
            End Date
          </Label>
          <Input
            id="endDate"
            {...register("endDate")}
            placeholder="Dec 2023"
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
          Currently working here
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
        <Label className="text-gray-300">Description</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Describe your role and responsibilities..."
            />
          )}
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
            ? "Update Experience"
            : "Create Experience"}
        </Button>
        <Button
          asChild
          variant="ghost"
          className="text-gray-400 hover:text-white"
        >
          <Link href="/admin/experience">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
