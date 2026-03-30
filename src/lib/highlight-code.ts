import { createHighlighter } from "shiki";

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark"],
      langs: ["javascript", "typescript", "tsx", "jsx", "python", "go", "bash", "sh", "json", "sql", "css", "html", "yaml", "markdown"],
    });
  }
  return highlighterPromise;
}

/**
 * Replaces <pre><code class="language-X">...</code></pre> blocks with
 * shiki-highlighted HTML. Runs on the server at render time.
 */
export async function highlightCodeBlocks(html: string): Promise<string> {
  // TipTap CodeBlockLowlight outputs: <pre><code class="language-X">...</code></pre>
  const codeBlockRegex = /<pre><code(?:\s+class="language-([^"]*)")?>([\s\S]*?)<\/code><\/pre>/gi;
  const matches = [...html.matchAll(codeBlockRegex)];

  if (matches.length === 0) return html;

  const highlighter = await getHighlighter();
  let result = html;

  for (const match of matches) {
    const [fullMatch, rawLang, rawCode] = match;
    const lang = rawLang?.trim() || "plaintext";
    // Decode HTML entities that TipTap encodes
    const code = rawCode
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    try {
      const highlighted = highlighter.codeToHtml(code, {
        lang: lang === "plaintext" ? "text" : lang,
        theme: "github-dark",
      });
      // Wrap with a relative container so the copy button can be positioned
      const wrapped = highlighted.replace(
        "<pre ",
        `<pre data-language="${lang}" `
      );
      result = result.replace(fullMatch, wrapped);
    } catch {
      // Leave the block as-is if the language isn't supported
    }
  }

  return result;
}
