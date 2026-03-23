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

type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
const CEFR: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

interface LanguageFormData {
  name: string;
  isMother: boolean;
  listening: string;
  reading: string;
  writing: string;
  spokenProduction: string;
  spokenInteraction: string;
  order: number;
  visible: boolean;
}

interface Language {
  id: number;
  name: string;
  isMother: boolean;
  listening: string | null;
  reading: string | null;
  writing: string | null;
  spokenProduction: string | null;
  spokenInteraction: string | null;
  order: number;
  visible: boolean;
}

interface LanguageFormProps {
  language?: Language;
}

const CEFR_SKILLS = [
  { key: "listening",         label: "Listening" },
  { key: "reading",           label: "Reading" },
  { key: "writing",           label: "Writing" },
  { key: "spokenProduction",  label: "Spoken Production" },
  { key: "spokenInteraction", label: "Spoken Interaction" },
] as const;

function CefrSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-gray-400 text-xs uppercase tracking-wide">{label}</Label>
      <Select value={value} onValueChange={(v) => v && onChange(v)}>
        <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-violet-500 h-9">
          <SelectValue placeholder="—" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-white/10 text-white">
          {CEFR.map((l) => (
            <SelectItem key={l} value={l}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function LanguageForm({ language }: LanguageFormProps) {
  const router = useRouter();
  const isEditing = !!language;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LanguageFormData>({
    defaultValues: {
      name: language?.name ?? "",
      isMother: language?.isMother ?? false,
      listening: language?.listening ?? "B2",
      reading: language?.reading ?? "B2",
      writing: language?.writing ?? "B2",
      spokenProduction: language?.spokenProduction ?? "B2",
      spokenInteraction: language?.spokenInteraction ?? "B2",
      order: language?.order ?? 0,
      visible: language?.visible ?? true,
    },
  });

  const isMother = watch("isMother");

  const onSubmit = async (data: LanguageFormData) => {
    const payload = {
      ...data,
      order: Number(data.order),
      listening: data.isMother ? null : data.listening,
      reading: data.isMother ? null : data.reading,
      writing: data.isMother ? null : data.writing,
      spokenProduction: data.isMother ? null : data.spokenProduction,
      spokenInteraction: data.isMother ? null : data.spokenInteraction,
    };

    try {
      const url = isEditing ? `/api/languages/${language.id}` : "/api/languages";
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

      toast.success(isEditing ? "Language updated" : "Language created");
      router.push("/admin/languages");
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
          Language <span className="text-red-400">*</span>
        </Label>
        <Input
          id="name"
          {...register("name", { required: "Language name is required" })}
          placeholder="English"
          className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
        {errors.name && (
          <p className="text-red-400 text-xs">{errors.name.message}</p>
        )}
      </div>

      {/* Mother tongue toggle */}
      <div className="flex items-center gap-3">
        <Controller
          name="isMother"
          control={control}
          render={({ field }) => (
            <Switch
              id="isMother"
              checked={field.value}
              onCheckedChange={field.onChange}
              className={field.value ? "bg-violet-600" : undefined}
            />
          )}
        />
        <Label htmlFor="isMother" className="text-gray-300 cursor-pointer">
          Mother tongue
        </Label>
      </div>

      {/* CEFR skills — shown only for non-mother-tongue */}
      {!isMother && (
        <div className="space-y-3">
          <p className="text-sm text-gray-400">
            CEFR Proficiency Levels
            <span className="text-gray-600 text-xs ml-2">
              A1–A2 Basic · B1–B2 Independent · C1–C2 Proficient
            </span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {CEFR_SKILLS.map(({ key, label }) => (
              <CefrSelect
                key={key}
                label={label}
                value={watch(key)}
                onChange={(v) => setValue(key, v)}
              />
            ))}
          </div>
        </div>
      )}

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
          {isSubmitting ? "Saving..." : isEditing ? "Update Language" : "Create Language"}
        </Button>
        <Button asChild variant="ghost" className="text-gray-400 hover:text-white">
          <Link href="/admin/languages">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
