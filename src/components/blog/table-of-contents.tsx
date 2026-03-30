"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/heading-ids";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Contents</h3>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`text-sm leading-snug transition-colors py-0.5 ${
              item.level === 3 ? "pl-3" : ""
            } ${
              activeId === item.id
                ? "text-violet-700 font-medium"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
