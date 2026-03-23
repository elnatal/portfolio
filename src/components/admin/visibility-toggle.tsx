"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface VisibilityToggleProps {
  id: number;
  visible: boolean;
  endpoint: string; // e.g. "/api/experience"
}

export function VisibilityToggle({ id, visible, endpoint }: VisibilityToggleProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(visible);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const next = !current;
    setCurrent(next); // optimistic
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: next }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setCurrent(!next); // revert
      toast.error("Failed to update visibility");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      disabled={loading}
      title={current ? "Visible — click to hide" : "Hidden — click to show"}
      className={
        current
          ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
          : "text-gray-600 hover:text-gray-400 hover:bg-white/5"
      }
    >
      {current ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
    </Button>
  );
}
