import { NextResponse } from "next/server";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.GROQ_API_KEY)
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });

  const { content, title } = await req.json();
  if (!content && !title)
    return NextResponse.json({ error: "content or title required" }, { status: 400 });

  const plainText = (content ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 3000);
  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

  const { text } = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    system: `You are a tagging assistant for a developer blog. Given a blog post title and content, suggest 5-8 relevant tags.
Return ONLY a JSON array of lowercase tag strings, no other text. Example: ["typescript","react","performance","web-dev"]`,
    prompt: `Title: ${title ?? ""}\n\nContent: ${plainText}`,
    maxOutputTokens: 100,
    temperature: 0.3,
  });

  try {
    const tags = JSON.parse(text.trim());
    return NextResponse.json({ tags: Array.isArray(tags) ? tags : [] });
  } catch {
    // Try to extract JSON array from the response
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        const tags = JSON.parse(match[0]);
        return NextResponse.json({ tags: Array.isArray(tags) ? tags : [] });
      } catch {
        // ignore
      }
    }
    return NextResponse.json({ tags: [] });
  }
}
