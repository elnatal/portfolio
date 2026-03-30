"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  Tag,
  Loader2,
  Wand2,
  RotateCcw,
  CheckCheck,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/admin/image-upload";
import { BlogRichTextEditor } from "@/components/admin/blog-rich-text-editor";

interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  status: string;
  publishedAt: Date | string | null;
  scheduledAt: Date | string | null;
  featured: boolean;
  visible: boolean;
  order: number;
  tags: Array<{ tagId: number; tag: BlogTag }>;
}

interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: string;
  scheduledAt: string;
  featured: boolean;
  visible: boolean;
  order: number;
  tagIds: number[];
}

interface BlogPostFormProps {
  post?: BlogPost;
  allTags: BlogTag[];
}

// ─── Parses the streamed output into title / excerpt / content ───────────────
function parseStream(raw: string): {
  title: string;
  excerpt: string;
  content: string;
  done: boolean;
} {
  const titleMatch = raw.match(/^TITLE:\s*(.+)/m);
  const excerptMatch = raw.match(/^EXCERPT:\s*(.+)/m);
  const divider = raw.indexOf("---CONTENT---");

  const title = titleMatch?.[1]?.trim() ?? "";
  const excerpt = excerptMatch?.[1]?.trim() ?? "";
  const content = divider !== -1 ? raw.slice(divider + 13).trimStart() : "";
  const done = divider !== -1 && raw.length > divider + 13 + 20; // at least some HTML after marker

  return { title, excerpt, content, done };
}

export function BlogPostForm({ post, allTags }: BlogPostFormProps) {
  const router = useRouter();
  const isEditing = !!post;

  // ── Existing AI helpers state ──────────────────────────────────────────────
  const [aiHelpOpen, setAiHelpOpen] = useState(false);
  const [loadingAiTags, setLoadingAiTags] = useState(false);
  const [loadingAiSummary, setLoadingAiSummary] = useState(false);
  const [aiSuggestedTags, setAiSuggestedTags] = useState<string[]>([]);

  // ── AI Generator sidebar state ─────────────────────────────────────────────
  const [genContext, setGenContext] = useState("");
  const [genTone, setGenTone] = useState("technical");
  const [genLength, setGenLength] = useState("medium");
  const [generating, setGenerating] = useState(false);
  const [genRaw, setGenRaw] = useState("");
  const [applied, setApplied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const parsed = parseStream(genRaw);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogPostFormData>({
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      content: post?.content ?? "",
      coverImage: post?.coverImage ?? "",
      status: post?.status ?? "draft",
      scheduledAt: post?.scheduledAt
        ? new Date(post.scheduledAt).toISOString().slice(0, 16)
        : "",
      featured: post?.featured ?? false,
      visible: post?.visible ?? true,
      order: post?.order ?? 0,
      tagIds: post?.tags.map((t) => t.tagId) ?? [],
    },
  });

  const watchedStatus = watch("status");
  const watchedContent = watch("content");
  const watchedTitle = watch("title");
  const watchedTagIds = watch("tagIds");

  // ── Tag helpers ────────────────────────────────────────────────────────────
  const toggleTag = (id: number) => {
    const current = watchedTagIds ?? [];
    setValue(
      "tagIds",
      current.includes(id) ? current.filter((t) => t !== id) : [...current, id],
    );
  };

  const addSuggestedTag = async (tagName: string) => {
    const existing = allTags.find(
      (t) => t.name.toLowerCase() === tagName.toLowerCase(),
    );
    if (existing) {
      const current = watchedTagIds ?? [];
      if (!current.includes(existing.id))
        setValue("tagIds", [...current, existing.id]);
      setAiSuggestedTags((prev) => prev.filter((t) => t !== tagName));
      return;
    }
    try {
      const res = await fetch("/api/blog/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tagName }),
      });
      if (res.ok) {
        const newTag: BlogTag = await res.json();
        allTags.push(newTag);
        setValue("tagIds", [...(watchedTagIds ?? []), newTag.id]);
        setAiSuggestedTags((prev) => prev.filter((t) => t !== tagName));
        toast.success(`Tag "${tagName}" added`);
      }
    } catch {
      toast.error("Failed to add tag");
    }
  };

  const handleAiTags = async () => {
    setLoadingAiTags(true);
    try {
      const res = await fetch("/api/blog/ai-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: watchedContent, title: watchedTitle }),
      });
      if (res.ok) setAiSuggestedTags((await res.json()).tags as string[]);
      else toast.error("Failed to get AI tag suggestions");
    } catch {
      toast.error("AI request failed");
    } finally {
      setLoadingAiTags(false);
    }
  };

  const handleAiSummary = async () => {
    setLoadingAiSummary(true);
    try {
      const res = await fetch("/api/blog/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: watchedContent, title: watchedTitle }),
      });
      if (res.ok) {
        setValue("excerpt", (await res.json()).summary);
        toast.success("Summary generated — review and edit as needed");
      } else toast.error("Failed to generate summary");
    } catch {
      toast.error("AI request failed");
    } finally {
      setLoadingAiSummary(false);
    }
  };

  // ── AI Generator ───────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!genContext.trim()) return;
    setGenerating(true);
    setGenRaw("");
    setApplied(false);
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/blog/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: genContext,
          tone: genTone,
          length: genLength,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        toast.error("Generation failed");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setGenRaw(accumulated);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError")
        toast.error("Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleApply = () => {
    if (!parsed.title && !parsed.content) return;
    if (parsed.title) setValue("title", parsed.title);
    if (parsed.excerpt) setValue("excerpt", parsed.excerpt);
    if (parsed.content) setValue("content", parsed.content);
    setApplied(true);
    toast.success("Generated content applied to form");
  };

  const handleReset = () => {
    setGenRaw("");
    setApplied(false);
    abortRef.current?.abort();
  };

  // ── Form submit ────────────────────────────────────────────────────────────
  const onSubmit = async (data: BlogPostFormData) => {
    const payload = {
      ...data,
      slug: data.slug.trim() || undefined,
      excerpt: data.excerpt || null,
      coverImage: data.coverImage || null,
      scheduledAt:
        data.status === "scheduled" && data.scheduledAt
          ? new Date(data.scheduledAt).toISOString()
          : null,
      order: Number(data.order),
      tagIds: data.tagIds ?? [],
    };

    try {
      const res = await fetch(
        isEditing ? `/api/blog/${post.id}` : "/api/blog",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok)
        throw new Error((await res.json()).error ?? "Something went wrong");
      toast.success(isEditing ? "Post updated" : "Post created");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const inputCls =
    "bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex gap-6 items-start">
      {/* ═══════════════ FORM (left) ═══════════════════════════════════════ */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 flex-1 min-w-0"
      >
        {/* ── Section 1: Meta ──────────────────────────────────── */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-5">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Post Details
          </h2>

          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-gray-300">
              Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              placeholder="My Blog Post Title"
              className={inputCls}
            />
            {errors.title && (
              <p className="text-red-400 text-xs">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug" className="text-gray-300">
              URL Slug
              <span className="text-gray-500 text-xs font-normal ml-2">
                — leave blank to auto-generate
              </span>
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm shrink-0">/blog/</span>
              <Input
                id="slug"
                {...register("slug")}
                placeholder="my-blog-post-title"
                className={inputCls}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="excerpt" className="text-gray-300">
              Excerpt
              <span className="text-gray-500 text-xs font-normal ml-2">
                — shown on cards and as meta description
              </span>
            </Label>
            <Textarea
              id="excerpt"
              {...register("excerpt")}
              placeholder="A concise summary of what this post is about..."
              rows={2}
              maxLength={300}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-gray-300">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={inputCls}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {watchedStatus === "scheduled" && (
              <div className="space-y-1.5">
                <Label htmlFor="scheduledAt" className="text-gray-300">
                  Scheduled Date
                </Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  {...register("scheduledAt")}
                  className={inputCls}
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <Controller
                name="featured"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="featured"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label
                htmlFor="featured"
                className="text-gray-300 cursor-pointer"
              >
                Featured post
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Controller
                name="visible"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="visible"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={field.value ? "bg-emerald-500" : undefined}
                  />
                )}
              />
              <Label htmlFor="visible" className="text-gray-300 cursor-pointer">
                Visible on blog
              </Label>
            </div>
          </div>

          <div className="space-y-1.5 max-w-xs">
            <Label htmlFor="order" className="text-gray-300">
              Display Order
            </Label>
            <Input
              id="order"
              type="number"
              {...register("order")}
              placeholder="0"
              className={inputCls}
            />
          </div>
        </div>

        {/* ── Section 2: Cover Image ───────────────────────────── */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Cover Image
          </h2>
          <Controller
            name="coverImage"
            control={control}
            render={({ field }) => (
              <ImageUpload
                value={field.value}
                onChange={field.onChange}
                label="Cover Image"
              />
            )}
          />
        </div>

        {/* ── Section 3: Content ──────────────────────────────── */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Content
          </h2>
          <Controller
            name="content"
            control={control}
            rules={{ required: "Content is required" }}
            render={({ field }) => (
              <BlogRichTextEditor
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.content && (
            <p className="text-red-400 text-xs">{errors.content.message}</p>
          )}
        </div>

        {/* ── Section 4: Tags ─────────────────────────────────── */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Tags
          </h2>
          {allTags.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No tags yet.{" "}
              <Link
                href="/admin/blog/tags"
                className="text-violet-400 hover:underline"
              >
                Create tags first
              </Link>
              .
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const selected = (watchedTagIds ?? []).includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      selected
                        ? "bg-violet-600/30 border-violet-500/60 text-violet-300"
                        : "bg-white/5 border-white/10 text-gray-400 hover:border-violet-500/40 hover:text-gray-200"
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    {tag.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Section 5: AI Helpers (tag suggest + excerpt) ────── */}
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 overflow-hidden">
          <button
            type="button"
            onClick={() => setAiHelpOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium text-violet-300 hover:text-violet-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Helpers
            </div>
            {aiHelpOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {aiHelpOpen && (
            <div className="px-5 pb-5 space-y-4 border-t border-violet-500/20">
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-300">Suggest Tags</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAiTags}
                    disabled={loadingAiTags || !watchedContent}
                    className="h-7 text-xs border-violet-500/40 text-violet-300 hover:bg-violet-500/10 bg-transparent"
                  >
                    {loadingAiTags ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />{" "}
                        Thinking...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 mr-1" /> Suggest
                      </>
                    )}
                  </Button>
                </div>
                {aiSuggestedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {aiSuggestedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addSuggestedTag(tag)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition-all"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-300">Generate Excerpt</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAiSummary}
                    disabled={loadingAiSummary || !watchedContent}
                    className="h-7 text-xs border-violet-500/40 text-violet-300 hover:bg-violet-500/10 bg-transparent"
                  >
                    {loadingAiSummary ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />{" "}
                        Writing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 mr-1" /> Generate
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Pre-fills the excerpt field from your content.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Actions ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Post"
                : "Create Post"}
          </Button>
          <Button
            asChild
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <Link href="/admin/blog">Cancel</Link>
          </Button>
        </div>
      </form>

      {/* ═══════════════ AI GENERATOR SIDEBAR (right) ══════════════════════ */}
      <aside className="w-80 shrink-0 sticky top-8 space-y-0">
        <div className="rounded-xl border border-violet-500/30 bg-violet-950/40 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-violet-500/20 bg-violet-500/10">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-violet-600">
              <Wand2 className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">
                AI Blog Generator
              </p>
              <p className="text-[10px] text-violet-400 mt-0.5">
                Write a full post from a brief context
              </p>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Context input */}
            <div className="space-y-1.5">
              <Label className="text-gray-300 text-xs">Topic / Context</Label>
              <Textarea
                value={genContext}
                onChange={(e) => setGenContext(e.target.value)}
                placeholder={`e.g. "How I built a distributed task queue in Go using Redis Streams, with retry logic and dead-letter queues"`}
                rows={4}
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-violet-500 text-xs resize-none"
              />
            </div>

            {/* Tone + Length */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-gray-400 text-[10px] uppercase tracking-wider">
                  Tone
                </Label>
                <Select
                  value={genTone}
                  onValueChange={(v) => {
                    if (v) setGenTone(v);
                  }}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="conversational">
                      Conversational
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-gray-400 text-[10px] uppercase tracking-wider">
                  Length
                </Label>
                <Select
                  value={genLength}
                  onValueChange={(v) => {
                    if (v) setGenLength(v);
                  }}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generate button */}
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={generating || !genContext.trim()}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white text-sm"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" /> Generate Blog Post
                </>
              )}
            </Button>

            {/* Output preview */}
            {genRaw && (
              <div className="space-y-3">
                <div className="h-px bg-white/10" />

                {/* Title preview */}
                {parsed.title && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Title
                    </p>
                    <p className="text-white text-xs font-semibold leading-snug">
                      {parsed.title}
                    </p>
                  </div>
                )}

                {/* Excerpt preview */}
                {parsed.excerpt && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                      Excerpt
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                      {parsed.excerpt}
                    </p>
                  </div>
                )}

                {/* Content preview */}
                {parsed.content && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      Content
                      {generating && (
                        <Loader2 className="w-3 h-3 animate-spin text-violet-400" />
                      )}
                    </p>
                    <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 max-h-40 overflow-y-auto">
                      <p className="text-gray-400 text-xs leading-relaxed font-mono whitespace-pre-wrap">
                        {parsed.content.replace(/<[^>]+>/g, "").slice(0, 400)}
                        {parsed.content.replace(/<[^>]+>/g, "").length > 400
                          ? "…"
                          : ""}
                      </p>
                    </div>
                  </div>
                )}

                {/* Apply / Reset buttons */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleApply}
                    disabled={generating || (!parsed.title && !parsed.content)}
                    className={`flex-1 text-xs h-8 ${
                      applied
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-violet-600 hover:bg-violet-700"
                    } text-white`}
                  >
                    {applied ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 mr-1.5" /> Applied
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5 mr-1.5" /> Apply to
                        Form
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleReset}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2.5 text-gray-400 hover:text-white"
                    title="Clear"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
