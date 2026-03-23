"use client";

import { useState } from "react";
import Image from "next/image";
import { ProjectPlaceholder } from "@/components/portfolio/project-placeholder";

interface ProjectGalleryProps {
  images: string[];
  name: string;
  seed?: number;
}

export function ProjectGallery({ images, name, seed = 0 }: ProjectGalleryProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 mb-8 shadow-md">
        <ProjectPlaceholder className="absolute inset-0" seed={seed} />
      </div>
    );
  }

  return (
    <div className="space-y-2 mb-8">
      {/* Main image */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-md">
        <Image
          src={images[active]}
          alt={`${name} — image ${active + 1}`}
          fill
          className="object-cover"
          priority={active === 0}
        />
      </div>

      {/* Thumbnails — only when more than one image */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                i === active
                  ? "border-violet-500 shadow-sm"
                  : "border-gray-200 opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={url} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
