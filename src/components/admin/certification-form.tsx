"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/image-upload";

interface CertificationFormData {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
  imageUrl: string;
  visible: boolean;
  order: number;
}

interface Certification {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  imageUrl: string | null;
  visible: boolean;
  order: number;
}

interface CertificationFormProps {
  certification?: Certification;
}

export function CertificationForm({ certification }: CertificationFormProps) {
  const router = useRouter();
  const isEditing = !!certification;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CertificationFormData>({
    defaultValues: {
      name: certification?.name ?? "",
      issuer: certification?.issuer ?? "",
      issueDate: certification?.issueDate ?? "",
      expiryDate: certification?.expiryDate ?? "",
      credentialId: certification?.credentialId ?? "",
      credentialUrl: certification?.credentialUrl ?? "",
      imageUrl: certification?.imageUrl ?? "",
      visible: certification?.visible ?? true,
      order: certification?.order ?? 0,
    },
  });

  const onSubmit = async (data: CertificationFormData) => {
    const payload = {
      ...data,
      order: Number(data.order),
      expiryDate: data.expiryDate || null,
      credentialId: data.credentialId || null,
      credentialUrl: data.credentialUrl || null,
      imageUrl: data.imageUrl || null,
    };

    try {
      const url = isEditing
        ? `/api/certifications/${certification.id}`
        : "/api/certifications";
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
          ? "Certification updated successfully"
          : "Certification created successfully"
      );
      router.push("/admin/certifications");
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
          Certification Name <span className="text-red-400">*</span>
        </Label>
        <Input
          id="name"
          {...register("name", { required: "Name is required" })}
          placeholder="AWS Certified Solutions Architect"
          className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
        {errors.name && (
          <p className="text-red-400 text-xs">{errors.name.message}</p>
        )}
      </div>

      {/* Issuer */}
      <div className="space-y-1.5">
        <Label htmlFor="issuer" className="text-gray-300">
          Issuing Organization <span className="text-red-400">*</span>
        </Label>
        <Input
          id="issuer"
          {...register("issuer", { required: "Issuer is required" })}
          placeholder="Amazon Web Services"
          className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
        />
        {errors.issuer && (
          <p className="text-red-400 text-xs">{errors.issuer.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Issue Date */}
        <div className="space-y-1.5">
          <Label htmlFor="issueDate" className="text-gray-300">
            Issue Date <span className="text-red-400">*</span>
          </Label>
          <Input
            id="issueDate"
            {...register("issueDate", { required: "Issue date is required" })}
            placeholder="Jan 2023"
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
          />
          {errors.issueDate && (
            <p className="text-red-400 text-xs">{errors.issueDate.message}</p>
          )}
        </div>

        {/* Expiry Date */}
        <div className="space-y-1.5">
          <Label htmlFor="expiryDate" className="text-gray-300">
            Expiry Date
            <span className="text-gray-500 text-xs font-normal ml-2">— leave blank if no expiry</span>
          </Label>
          <Input
            id="expiryDate"
            {...register("expiryDate")}
            placeholder="Jan 2026"
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
          />
        </div>

        {/* Credential ID */}
        <div className="space-y-1.5">
          <Label htmlFor="credentialId" className="text-gray-300">
            Credential ID
          </Label>
          <Input
            id="credentialId"
            {...register("credentialId")}
            placeholder="ABC123XYZ"
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
          />
        </div>

        {/* Credential URL */}
        <div className="space-y-1.5">
          <Label htmlFor="credentialUrl" className="text-gray-300">
            Credential URL
          </Label>
          <Input
            id="credentialUrl"
            {...register("credentialUrl")}
            placeholder="https://credentials.example.com/verify/..."
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
          />
        </div>
      </div>

      {/* Image */}
      <Controller
        name="imageUrl"
        control={control}
        render={({ field }) => (
          <ImageUpload
            value={field.value}
            onChange={field.onChange}
            label="Badge / Logo (optional)"
          />
        )}
      />

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
            ? "Update Certification"
            : "Create Certification"}
        </Button>
        <Button asChild variant="ghost" className="text-gray-400 hover:text-white">
          <Link href="/admin/certifications">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
