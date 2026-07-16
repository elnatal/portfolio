"use client";

import { useState } from "react";
import Image from "next/image";
import { Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AiImageDialogProps {
  onSelect: (url: string) => void;
}

export function AiImageDialog({ onSelect }: AiImageDialogProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description");
      return;
    }
    setGenerating(true);
    setPreviewUrl(null);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setPreviewUrl(data.url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleUse = () => {
    if (!previewUrl) return;
    onSelect(previewUrl);
    setPrompt("");
    setPreviewUrl(null);
    setOpen(false);
  };

  const handleClose = () => {
    setPrompt("");
    setPreviewUrl(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-1.5 rounded-md px-3 h-8 text-sm font-medium text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-colors">
        <Wand2 className="w-4 h-4" />
        Generate with AI
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Image with AI</DialogTitle>
          <DialogDescription className="text-gray-400">
            Describe the image you want to generate
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Textarea
            placeholder="A dark minimalist tech background with a purple gradient and subtle grid pattern..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={generating}
            rows={3}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 resize-none"
          />

          <Button
            type="button"
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate
              </>
            )}
          </Button>

          {previewUrl && (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
              <Image src={previewUrl} alt="AI Generated" fill className="object-cover" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUse}
            disabled={!previewUrl}
          >
            Use this image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
