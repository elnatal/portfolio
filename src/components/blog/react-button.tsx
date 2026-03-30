"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface ReactButtonProps {
  postId: number;
  initialReactions: number;
}

export function ReactButton({ postId, initialReactions }: ReactButtonProps) {
  const [count, setCount] = useState(initialReactions);
  const [reacted, setReacted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setReacted(localStorage.getItem(`reacted:${postId}`) === "1");
  }, [postId]);

  const handleReact = async () => {
    if (reacted || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/${postId}/reactions`, { method: "POST" });
      if (res.ok) {
        setCount((c) => c + 1);
        setReacted(true);
        localStorage.setItem(`reacted:${postId}`, "1");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Reactions</h3>
      <button
        onClick={handleReact}
        disabled={reacted || loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-medium ${
          reacted
            ? "bg-red-50 border-red-200 text-red-600 cursor-default"
            : "border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
        }`}
      >
        <Heart className={`w-4 h-4 ${reacted ? "fill-red-500 text-red-500" : ""}`} />
        {count}
      </button>
    </div>
  );
}
