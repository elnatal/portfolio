"use client";

import { useState } from "react";
import { Loader2, Copy, Check, FileText, Mail, ScrollText, MessageSquare, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Mode = "cover-letter" | "application-letter" | "email" | "qa";
type Status = "idle" | "streaming" | "done" | "error";

const MODES: {
  value: Mode;
  label: string;
  icon: React.ElementType;
  outputLabel: string;
  defaultParagraphs: number;
  minParagraphs: number;
  maxParagraphs: number;
}[] = [
  { value: "cover-letter",       label: "Cover Letter",       icon: FileText,      outputLabel: "Cover Letter",       defaultParagraphs: 4, minParagraphs: 2, maxParagraphs: 8 },
  { value: "application-letter", label: "Application Letter", icon: ScrollText,    outputLabel: "Application Letter", defaultParagraphs: 5, minParagraphs: 3, maxParagraphs: 8 },
  { value: "email",              label: "Email Application",  icon: Mail,          outputLabel: "Email Application",  defaultParagraphs: 3, minParagraphs: 2, maxParagraphs: 5 },
  { value: "qa",                 label: "Q&A",                icon: MessageSquare, outputLabel: "Answer",             defaultParagraphs: 3, minParagraphs: 1, maxParagraphs: 6 },
];

export function JobApplicationGenerator() {
  const [mode, setMode] = useState<Mode>("cover-letter");
  const [paragraphCount, setParagraphCount] = useState(MODES[0].defaultParagraphs);
  const [jobDescription, setJobDescription] = useState("");
  const [question, setQuestion] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);

  const jdCharCount = jobDescription.length;
  const isJdOverLimit = jdCharCount > 5000;
  const isJdTooShort = jobDescription.trim().length < 100;
  const isQuestionMissing = mode === "qa" && question.trim().length === 0;
  const canGenerate =
    !isJdTooShort && !isJdOverLimit && !isQuestionMissing && status !== "streaming";

  const activeMode = MODES.find((m) => m.value === mode)!;

  function handleModeChange(next: Mode) {
    const nextMode = MODES.find((m) => m.value === next)!;
    setMode(next);
    setParagraphCount(nextMode.defaultParagraphs);
    setOutput("");
    setStatus("idle");
  }

  function adjustParagraphs(delta: number) {
    setParagraphCount((prev) =>
      Math.min(activeMode.maxParagraphs, Math.max(activeMode.minParagraphs, prev + delta))
    );
  }

  async function handleGenerate() {
    setStatus("streaming");
    setOutput("");

    try {
      const res = await fetch("/api/job-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          jobDescription,
          paragraphCount,
          ...(mode === "qa" && { question }),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error ?? "Request failed");
      }

      if (!res.body) throw new Error("No response body");

      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((prev) => prev + value);
      }

      setStatus("done");
    } catch (err) {
      setStatus("error");
      toast.error(err instanceof Error ? err.message : "Generation failed");
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const showOutput = status !== "idle" || output.length > 0;
  const isDefault = paragraphCount === activeMode.defaultParagraphs;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Mode selector */}
      <div className="flex flex-wrap gap-2">
        {MODES.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => handleModeChange(value)}
            disabled={status === "streaming"}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium border transition-all duration-150 disabled:opacity-50",
              mode === value
                ? "bg-violet-600/20 text-violet-300 border-violet-500/30"
                : "text-gray-400 border-white/10 hover:text-white hover:bg-white/5"
            )}
          >
            <Icon className={cn("w-4 h-4", mode === value ? "text-violet-400" : "text-gray-500")} />
            {label}
          </button>
        ))}
      </div>

      {/* Input card */}
      <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-4">
        {/* Job description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Job Description</label>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500 resize-y"
            disabled={status === "streaming"}
          />
          <p
            className={cn(
              "mt-1.5 text-xs text-right transition-colors",
              isJdOverLimit ? "text-red-400" : jdCharCount > 4500 ? "text-amber-400" : "text-gray-500"
            )}
          >
            {jdCharCount.toLocaleString()} / 5,000
          </p>
        </div>

        {/* Question input — Q&A mode only */}
        {mode === "qa" && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Question</label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Tell me about a time you improved system performance..."
              className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500 resize-y"
              disabled={status === "streaming"}
            />
            <p className="mt-1.5 text-xs text-right text-gray-500">
              {question.length.toLocaleString()} / 1,000
            </p>
          </div>
        )}

        {/* Paragraph count + generate row */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Paragraph count stepper */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Paragraphs</span>
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => adjustParagraphs(-1)}
                disabled={paragraphCount <= activeMode.minParagraphs || status === "streaming"}
                className="flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease paragraphs"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-6 text-center text-sm font-medium text-white tabular-nums">
                {paragraphCount}
              </span>
              <button
                onClick={() => adjustParagraphs(1)}
                disabled={paragraphCount >= activeMode.maxParagraphs || status === "streaming"}
                className="flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase paragraphs"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            {!isDefault && (
              <button
                onClick={() => setParagraphCount(activeMode.defaultParagraphs)}
                disabled={status === "streaming"}
                className="text-xs text-violet-400 hover:text-violet-300 disabled:opacity-50 transition-colors"
              >
                reset to default ({activeMode.defaultParagraphs})
              </button>
            )}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50"
          >
            {status === "streaming" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <activeMode.icon className="w-4 h-4 mr-2" />
                Generate {activeMode.outputLabel}
              </>
            )}
          </Button>
        </div>

        {isJdTooShort && jobDescription.length > 0 && (
          <p className="text-xs text-amber-400">Job description must be at least 100 characters.</p>
        )}
      </div>

      {/* Output card */}
      {showOutput && (
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-300">{activeMode.outputLabel}</span>
              {status === "streaming" && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-2.5 py-0.5">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating
                </span>
              )}
              {status === "done" && (
                <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-0.5">
                  Ready
                </span>
              )}
              {status === "error" && (
                <span className="text-xs font-medium text-red-400 bg-red-400/10 border border-red-400/20 rounded-full px-2.5 py-0.5">
                  Error
                </span>
              )}
            </div>

            {status === "done" && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="text-gray-400 hover:text-white hover:bg-white/10 gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 min-h-[200px]">
            {status === "error" ? (
              <p className="text-sm text-red-400">Generation failed. Please try again.</p>
            ) : (
              <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-200 break-words">
                {output}
                {status === "streaming" && (
                  <span className="inline-block w-0.5 h-4 bg-violet-400 animate-pulse ml-0.5 align-middle" />
                )}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
