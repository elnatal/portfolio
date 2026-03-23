"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export function MultiImageUpload({ value, onChange, max = 6 }: MultiImageUploadProps) {
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

      onChange([...value, data.url]);
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
    if (value.length >= max) {
      toast.error(`Maximum ${max} images allowed`);
      return;
    }
    upload(file);
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Existing images grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {value.map((url, i) => (
            <div key={url} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video">
              <Image
                src={url}
                alt={`Image ${i + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-1.5 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-violet-600/90 text-white">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add more / empty state */}
      {value.length < max && (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          className={`
            flex flex-col items-center justify-center gap-2 h-28 rounded-xl
            border-2 border-dashed transition-colors cursor-pointer
            ${dragOver ? "border-violet-500 bg-violet-500/10" : "border-white/10 hover:border-white/20 bg-white/5"}
            ${uploading ? "cursor-not-allowed opacity-60" : ""}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
              <p className="text-xs text-gray-400">Uploading...</p>
            </>
          ) : (
            <>
              <ImagePlus className="w-6 h-6 text-gray-500" />
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  {value.length === 0 ? "Click or drag to upload images" : "Add another image"}
                </p>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  {value.length}/{max} · PNG, JPG, WebP — max 5 MB
                </p>
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
