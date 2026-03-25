import { streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { NextRequest } from "next/server";
import { buildPortfolioContext } from "@/lib/portfolio-context";

type Mode = "cover-letter" | "application-letter" | "email" | "qa";

function buildPrompt(
  mode: Mode,
  ownerName: string,
  context: string,
  jobDescription: string,
  paragraphCount: number,
  question?: string
): { system: string; userMessage: string } {
  const profile = `--- CANDIDATE PROFILE ---\n${context}\n--- END PROFILE ---`;
  const paraRule = `Write exactly ${paragraphCount} paragraph${paragraphCount === 1 ? "" : "s"}`;

  switch (mode) {
    case "cover-letter":
      return {
        system: `You are a professional cover letter writer helping ${ownerName} apply for jobs. Write in first person as ${ownerName}. Be specific, confident, and avoid generic filler phrases.

RULES:
- ${paraRule}. Distribute content naturally: opening hook, relevant experience, skills/project alignment, and closing call to action across those paragraphs
- Match the tone implied by the job posting (formal for corporate, direct for startups)
- Do not fabricate experience — only use the candidate profile below
- Do not include a subject line or date header
- Do not start with "I am writing to express my interest..."
- Output plain text paragraphs only — no markdown headers, no bullet lists
- End with a confident call to action and ${ownerName}'s email address

${profile}`,
        userMessage: `Write a cover letter for the following job posting:\n\n${jobDescription}`,
      };

    case "application-letter":
      return {
        system: `You are a professional job application letter writer helping ${ownerName}. Write a formal, structured application letter in first person.

RULES:
- Start with today's date on the first line
- Then a blank line and "Dear Hiring Manager," (or use the company name from the job posting if visible)
- ${paraRule}. Cover: position being applied for, relevant experience with achievements, company alignment, technical skills and projects, and a formal closing with call to action — distributed across those paragraphs
- Formal and professional tone throughout
- End with: "Sincerely,\n\n${ownerName}\n[email]\n[phone]" — replace with actual values from the profile
- Do not fabricate experience — only use the candidate profile below
- Plain text only — no markdown

${profile}`,
        userMessage: `Write a formal application letter for the following job posting:\n\n${jobDescription}`,
      };

    case "email":
      return {
        system: `You are writing a job application email for ${ownerName}. Keep it concise and impactful — email applications must be scannable.

RULES:
- First line must be: "Subject: Application for [Role Title] — ${ownerName}"
- Then a blank line, then: "Dear Hiring Manager," (or company name if visible in the posting)
- ${paraRule}. Keep each paragraph short and punchy — cover who ${ownerName} is and the role, relevant achievements, and a call to action across those paragraphs
- Professional but warm and direct, not stiff
- End with: "Best regards,\n${ownerName}\n[email]\n[phone]" — replace with actual values from the profile
- Do not fabricate experience — only use the candidate profile below
- Plain text only — no markdown

${profile}`,
        userMessage: `Write a job application email for the following job posting:\n\n${jobDescription}`,
      };

    case "qa":
      return {
        system: `You are helping ${ownerName} craft a strong answer to a job application or interview question. Use their profile and the job description to make the answer specific and compelling.

RULES:
- Answer directly in first person as ${ownerName}
- Be specific — reference real experience, real projects, and real numbers from the profile
- Tailor the answer to the job description context where relevant
- ${paraRule}
- Do not fabricate experience — only use the candidate profile below
- Plain text paragraphs only — no markdown headers or bullet lists unless the question specifically calls for a list

--- JOB DESCRIPTION ---
${jobDescription}
--- END JOB DESCRIPTION ---

${profile}`,
        userMessage: `Answer the following question:\n\n${question}`,
      };
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return new Response(JSON.stringify({ error: "AI service not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: { jobDescription?: string; mode?: string; question?: string; paragraphCount?: number };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { jobDescription, question } = body ?? {};
  const mode = (body?.mode ?? "cover-letter") as Mode;
  const validModes: Mode[] = ["cover-letter", "application-letter", "email", "qa"];

  const DEFAULT_PARAGRAPHS: Record<Mode, number> = {
    "cover-letter": 4,
    "application-letter": 5,
    "email": 3,
    "qa": 3,
  };
  const rawParagraphCount = body?.paragraphCount;
  const paragraphCount =
    typeof rawParagraphCount === "number" && rawParagraphCount >= 1 && rawParagraphCount <= 10
      ? Math.round(rawParagraphCount)
      : DEFAULT_PARAGRAPHS[mode] ?? 4;

  if (!validModes.includes(mode)) {
    return new Response(JSON.stringify({ error: "Invalid mode" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!jobDescription || typeof jobDescription !== "string" || jobDescription.trim().length === 0) {
    return new Response(JSON.stringify({ error: "jobDescription is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (jobDescription.length > 5000) {
    return new Response(
      JSON.stringify({ error: "Job description too long (max 5000 characters)" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (mode === "qa") {
    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return new Response(JSON.stringify({ error: "question is required for Q&A mode" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (question.length > 1000) {
      return new Response(
        JSON.stringify({ error: "Question too long (max 1000 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  const { ownerName, context } = await buildPortfolioContext();
  const { system, userMessage } = buildPrompt(mode, ownerName, context, jobDescription, paragraphCount, question);

  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

  const result = await streamText({
    model: groq("llama-3.3-70b-versatile"),
    system,
    messages: [{ role: "user", content: userMessage }],
    maxOutputTokens: Math.min(300 + paragraphCount * (mode === "email" ? 80 : 150), 1200),
    temperature: 0.5,
  });

  return result.toTextStreamResponse();
}
