"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface PersonalInfoFormData {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
}

interface PersonalInfo extends PersonalInfoFormData {
  id: number;
}

interface PersonalInfoFormProps {
  info?: PersonalInfo | null;
}

export function PersonalInfoForm({ info }: PersonalInfoFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>({
    defaultValues: {
      name: info?.name ?? "",
      title: info?.title ?? "",
      bio: info?.bio ?? "",
      email: info?.email ?? "",
      phone: info?.phone ?? "",
      website: info?.website ?? "",
      location: info?.location ?? "",
      github: info?.github ?? "",
      linkedin: info?.linkedin ?? "",
      twitter: info?.twitter ?? "",
    },
  });

  const onSubmit = async (data: PersonalInfoFormData) => {
    const payload = {
      ...data,
      phone: data.phone || null,
      website: data.website || null,
      location: data.location || null,
      github: data.github || null,
      linkedin: data.linkedin || null,
      twitter: data.twitter || null,
    };

    try {
      const res = await fetch("/api/personal-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Something went wrong");
      }

      toast.success("Personal info updated successfully");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Basic Info */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-gray-300">
              Full Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
              placeholder="John Doe"
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
            />
            {errors.name && (
              <p className="text-red-400 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-gray-300">
              Title / Role <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="Senior Software Engineer"
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
            />
            {errors.title && (
              <p className="text-red-400 text-xs">{errors.title.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio" className="text-gray-300">
          Bio
        </Label>
        <Textarea
          id="bio"
          {...register("bio")}
          placeholder="A brief description about yourself..."
          rows={4}
          className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500 resize-none"
        />
      </div>

      <Separator className="bg-white/10" />

      {/* Contact Info */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Contact
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-gray-300">
              Email <span className="text-red-400">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="john@example.com"
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
            />
            {errors.email && (
              <p className="text-red-400 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-gray-300">
              Phone
            </Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="+1 (555) 000-0000"
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
            />
          </div>

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

          <div className="space-y-1.5">
            <Label htmlFor="website" className="text-gray-300">
              Website
            </Label>
            <Input
              id="website"
              {...register("website")}
              placeholder="https://example.com"
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
            />
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Social Links */}
      <div>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
          Social Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="github" className="text-gray-300">
              GitHub
            </Label>
            <Input
              id="github"
              {...register("github")}
              placeholder="https://github.com/username"
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="linkedin" className="text-gray-300">
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              {...register("linkedin")}
              placeholder="https://linkedin.com/in/username"
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="twitter" className="text-gray-300">
              Twitter / X
            </Label>
            <Input
              id="twitter"
              {...register("twitter")}
              placeholder="https://twitter.com/username"
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
