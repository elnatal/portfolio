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
  if (!content)
    return NextResponse.json({ error: "content is required" }, { status: 400 });

  const plainText = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 4000);
  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

  const { text } = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    system: `You are a technical writing assistant. Write a 2-3 sentence summary of a blog post that would work as a meta description or excerpt. Be concise, specific, and avoid filler phrases. Plain text only, no markdown.`,
    prompt: `Title: ${title ?? ""}\n\nContent: ${plainText}`,
    maxOutputTokens: 120,
    temperature: 0.4,
  });

  return NextResponse.json({ summary: text.trim() });
}
