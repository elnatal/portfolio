import { slugify } from "./slug";

/**
 * Adds `id` attributes to h2/h3 tags in HTML so they can be anchored from the TOC.
 * Uses a counter to ensure uniqueness when headings share the same text.
 */
export function addHeadingIds(html: string): string {
  const counts: Record<string, number> = {};

  return html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/h[23]>/gi, (_, tag, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    const base = slugify(text) || "heading";
    counts[base] = (counts[base] ?? 0) + 1;
    const id = counts[base] === 1 ? base : `${base}-${counts[base] - 1}`;

    // Remove any existing id attr, then add the new one
    const cleanAttrs = attrs.replace(/\s*id="[^"]*"/gi, "");
    return `<${tag}${cleanAttrs} id="${id}">${inner}</${tag}>`;
  });
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Extracts a table of contents from HTML that already has heading ids.
 */
export function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const regex = /<h([23])[^>]*id="([^"]*)"[^>]*>([\s\S]*?)<\/h[23]>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const level = Number(match[1]) as 2 | 3;
    const id = match[2];
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    if (id && text) items.push({ id, text, level });
  }

  return items;
}
