"use client";

import { useEffect } from "react";

export function ViewTracker({ postId }: { postId: number }) {
  useEffect(() => {
    fetch(`/api/blog/${postId}/views`, { method: "POST" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
