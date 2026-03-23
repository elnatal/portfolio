"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, X, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

const transport = new DefaultChatTransport({ api: "/api/chat" });

const INITIAL_MESSAGES: UIMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Hi there! 👋 I'm an AI assistant for this portfolio. I can answer questions about Elnatal's experience, skills, projects, and more. What would you like to know?",
      },
    ],
  },
];

const SUGGESTED_QUESTIONS = [
  "What are your main skills?",
  "Tell me about your experience",
  "What projects have you built?",
  "How can I contact you?",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const seenIds = useRef(new Set<string>(["welcome"]));

  const { messages, sendMessage, status, error } = useChat({
    transport,
    messages: INITIAL_MESSAGES,
  });

  const isLoading = status === "submitted" || status === "streaming";
  const showSuggestions = messages.length === 1 && !isLoading;

  // Scroll to bottom on every message update (including streaming chunks)
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Scroll to bottom when panel opens — double RAF ensures the DOM is painted and laid out
  useEffect(() => {
    if (!isOpen) return;
    let raf1: number;
    let raf2: number;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (el) el.scrollTop = el.scrollHeight;
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => textareaRef.current?.focus(), 200);
  }, [isOpen]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }, [input]);

  function open() {
    setIsOpen(true);
    setHasBeenOpened(true);
  }

  function submit(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || isLoading) return;
    setInput("");
    sendMessage({ text: msg });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const getMessageText = (m: (typeof messages)[0]) =>
    m.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as { type: "text"; text: string }).text)
      .join("");

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-[400px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl overflow-hidden"
            style={{
              height: "min(560px, calc(100vh - 120px))",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(124,58,237,0.08)",
            }}
          >
            {/* Header */}
            <div
              className="shrink-0 px-4 py-3.5 flex items-center gap-3"
              style={{
                background:
                  "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
                borderBottom: "1px solid #e9d5ff",
              }}
            >
              {/* Avatar */}
              <div
                className="size-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                  boxShadow: "0 2px 8px rgba(124,58,237,0.35)",
                }}
              >
                <Sparkles className="size-4 text-white" />
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold leading-tight"
                  style={{ color: "#1f2937" }}
                >
                  Portfolio Assistant
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="size-1.5 rounded-full bg-emerald-500"
                    style={{ boxShadow: "0 0 5px #10b981" }}
                  />
                  <span className="text-xs" style={{ color: "#6b7280" }}>
                    {isLoading ? "Thinking…" : "Online · Ask me anything"}
                  </span>
                </div>
              </div>

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="size-7 rounded-full flex items-center justify-center transition-colors"
                style={{ color: "#9ca3af" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "#f3f4f6";
                  (e.currentTarget as HTMLButtonElement).style.color = "#374151";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af";
                }}
                aria-label="Close chat"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
              style={{ background: "#f9fafb" }}
            >
              {messages.map((m) => {
                const text = getMessageText(m);
                if (!text) return null;
                const isUser = m.role === "user";

                // Only animate the first time a message appears, not on streaming updates
                const isNew = !seenIds.current.has(m.id);
                if (isNew) seenIds.current.add(m.id);

                return (
                  <motion.div
                    key={m.id}
                    initial={isNew ? { opacity: 0, y: 10 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "flex gap-2.5",
                      isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    {/* Bot avatar */}
                    {!isUser && (
                      <div
                        className="size-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background:
                            "linear-gradient(135deg, #7c3aed, #a78bfa)",
                        }}
                      >
                        <Bot className="size-3.5 text-white" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                        isUser ? "rounded-br-sm" : "rounded-bl-sm"
                      )}
                      style={
                        isUser
                          ? {
                              background:
                                "linear-gradient(135deg, #7c3aed, #6d28d9)",
                              color: "#ffffff",
                              boxShadow: "0 2px 10px rgba(124,58,237,0.25)",
                            }
                          : {
                              background: "#ffffff",
                              color: "#1f2937",
                              border: "1px solid #e5e7eb",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                            }
                      }
                    >
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="m-0 [&+p]:mt-2 leading-relaxed">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong className={cn("font-semibold", isUser ? "text-white" : "text-gray-900")}>
                              {children}
                            </strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="mt-1.5 space-y-0.5 pl-4 list-disc">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="mt-1.5 space-y-0.5 pl-4 list-decimal">{children}</ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed">{children}</li>
                          ),
                          h1: ({ children }) => <p className="font-semibold">{children}</p>,
                          h2: ({ children }) => <p className="font-semibold">{children}</p>,
                          h3: ({ children }) => <p className="font-semibold">{children}</p>,
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(
                                "underline underline-offset-2",
                                isUser
                                  ? "text-purple-200 hover:text-white"
                                  : "text-purple-600 hover:text-purple-800"
                              )}
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {text}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing indicator */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="flex gap-2.5 justify-start"
                  >
                    <div
                      className="size-7 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                      }}
                    >
                      <Bot className="size-3.5 text-white" />
                    </div>
                    <div
                      className="rounded-2xl rounded-bl-sm px-4 py-3"
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                      }}
                    >
                      <div className="flex gap-1.5 items-center">
                        {[0, 150, 300].map((delay) => (
                          <motion.span
                            key={delay}
                            className="size-1.5 rounded-full"
                            style={{ background: "#7c3aed" }}
                            animate={{ y: [0, -4, 0] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.8,
                              delay: delay / 1000,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center"
                  >
                    <p
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={{
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        color: "#ef4444",
                      }}
                    >
                      Something went wrong. Please try again.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Suggested questions */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-wrap gap-2 pt-1"
                  >
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => submit(q)}
                        className="text-xs px-3 py-1.5 rounded-full transition-all duration-150 hover:scale-[1.03] active:scale-[0.97]"
                        style={{
                          background: "#f5f3ff",
                          border: "1px solid #ddd6fe",
                          color: "#7c3aed",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            "#ede9fe";
                          (e.currentTarget as HTMLButtonElement).style.borderColor =
                            "#c4b5fd";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background =
                            "#f5f3ff";
                          (e.currentTarget as HTMLButtonElement).style.borderColor =
                            "#ddd6fe";
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div />
            </div>

            {/* Input */}
            <div
              className="shrink-0 p-3"
              style={{
                background: "#ffffff",
                borderTop: "1px solid #f3f4f6",
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="flex gap-2 items-end rounded-xl p-2"
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything…"
                  rows={1}
                  disabled={isLoading}
                  className="flex-1 resize-none bg-transparent text-sm outline-none leading-relaxed py-1 px-1 min-h-[28px] max-h-28 overflow-y-auto"
                  style={{
                    color: "#111827",
                    scrollbarWidth: "none",
                  }}
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  whileHover={input.trim() && !isLoading ? { scale: 1.05 } : {}}
                  whileTap={input.trim() && !isLoading ? { scale: 0.95 } : {}}
                  className="size-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150"
                  style={
                    input.trim() && !isLoading
                      ? {
                          background:
                            "linear-gradient(135deg, #7c3aed, #6d28d9)",
                          color: "#ffffff",
                          boxShadow: "0 2px 8px rgba(124,58,237,0.35)",
                        }
                      : {
                          background: "#e5e7eb",
                          color: "#9ca3af",
                          cursor: "not-allowed",
                        }
                  }
                  aria-label="Send message"
                >
                  <Send className="size-3.5" />
                </motion.button>
              </form>
              <p
                className="text-center text-[10px] mt-2"
                style={{ color: "#d1d5db" }}
              >
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <div className="relative">
        {/* Unread dot */}
        {!hasBeenOpened && (
          <span
            className="absolute -top-0.5 -right-0.5 size-3.5 rounded-full bg-emerald-500 z-10"
            style={{ boxShadow: "0 0 8px #10b981" }}
          >
            <motion.span
              className="absolute inset-0 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.8], opacity: [0.7, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </span>
        )}

        <motion.button
          onClick={() => (isOpen ? setIsOpen(false) : open())}
          className="size-14 rounded-full text-white flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            boxShadow: "0 8px 25px rgba(124,58,237,0.45)",
          }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 12px 35px rgba(124,58,237,0.6)",
          }}
          whileTap={{ scale: 0.93 }}
          aria-label={isOpen ? "Close chat" : "Open portfolio assistant"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.18 }}
              >
                <X className="size-5" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.18 }}
              >
                <MessageCircle className="size-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
