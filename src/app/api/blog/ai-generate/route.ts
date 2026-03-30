import { streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { auth } from "@/lib/auth";

const TONE_DESCRIPTIONS: Record<string, string> = {
  technical: "technical, precise, and developer-focused — use code examples where appropriate",
  educational: "educational and clear — explain concepts step-by-step with analogies",
  conversational: "conversational and engaging — like explaining to a colleague over coffee",
};

const LENGTH_TOKENS: Record<string, number> = {
  short: 800,
  medium: 1600,
  long: 2800,
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  if (!process.env.GROQ_API_KEY)
    return new Response(JSON.stringify({ error: "AI service not configured" }), { status: 503 });

  const { context, tone = "technical", length = "medium" } = await req.json();

  if (!context?.trim())
    return new Response(JSON.stringify({ error: "context is required" }), { status: 400 });

  const toneDesc = TONE_DESCRIPTIONS[tone] ?? TONE_DESCRIPTIONS.technical;
  const maxTokens = LENGTH_TOKENS[length] ?? LENGTH_TOKENS.medium;

  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

  const result = await streamText({
    model: groq("llama-3.3-70b-versatile"),
    system: `You are an expert technical blogger writing for a software engineer's portfolio blog. Write well-structured, high-quality blog posts that demonstrate deep knowledge.

TONE: ${toneDesc}

OUTPUT FORMAT — follow this EXACTLY, no deviations:
Line 1: TITLE: [the blog post title, no quotes]
Line 2: EXCERPT: [a compelling 2-3 sentence meta description/excerpt, plain text, no quotes]
Line 3: ---CONTENT---
Lines 4+: The full blog post body as valid HTML. Use these HTML elements only:
  - <h2 id="..."> for major sections (give each a short slug id)
  - <h3 id="..."> for subsections
  - <p> for paragraphs
  - <ul><li> and <ol><li> for lists
  - <strong> for emphasis
  - <em> for italics
  - <pre><code class="language-X"> for code blocks (replace X with the language)
  - <blockquote> for quotes or callouts
  - <hr> between major sections if needed

RULES:
- Start the content immediately after ---CONTENT--- with no blank lines
- Never include <html>, <head>, <body>, <style>, or markdown
- Never use classes other than language-X on code elements
- The h2/h3 id attributes must be lowercase kebab-case slugs matching the heading text
- Code blocks must be complete and runnable where possible
- Minimum 4 substantive sections with real depth
- Do not add a conclusion section title unless it adds value`,
    prompt: `Write a blog post about: ${context.trim()}`,
    maxOutputTokens: maxTokens,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
