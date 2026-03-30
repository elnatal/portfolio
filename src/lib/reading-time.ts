/**
 * Calculates estimated reading time from HTML content.
 * Strips tags, counts words, assumes 200 wpm.
 */
export function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}
