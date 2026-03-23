"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      onChange(data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    upload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-300">{label}</p>

      {value ? (
        <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-white/10 group">
          <Image
            src={value}
            alt="Preview"
            width={400}
            height={240}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => inputRef.current?.click()}
              className="text-white hover:bg-white/20"
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ImagePlus className="w-4 h-4" />
              )}
              Replace
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onChange("")}
              className="text-red-400 hover:bg-red-500/20"
            >
              <X className="w-4 h-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center gap-3 w-full max-w-sm h-40
            rounded-xl border-2 border-dashed transition-colors cursor-pointer
            ${dragOver
              ? "border-violet-500 bg-violet-500/10"
              : "border-white/10 hover:border-white/20 bg-white/5"
            }
            ${uploading ? "cursor-not-allowed opacity-60" : ""}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-7 h-7 text-violet-400 animate-spin" />
              <p className="text-sm text-gray-400">Uploading...</p>
            </>
          ) : (
            <>
              <ImagePlus className="w-7 h-7 text-gray-500" />
              <div className="text-center">
                <p className="text-sm text-gray-400">Click or drag to upload</p>
                <p className="text-xs text-gray-600 mt-0.5">PNG, JPG, WebP — max 5 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
