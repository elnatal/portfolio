# Light/Dark Theme Switcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a working light/dark theme switcher to the public portfolio pages, defaulting to the visitor's OS preference.

**Architecture:** Wire up the already-installed-but-unused `next-themes` library via a `ThemeProvider` in the root layout, using Tailwind's existing (also unused) `darkMode: ["class"]` config. Split the single dark-only CSS palette in `globals.css` into a new light `:root` block and a `.dark` block (the current values, unchanged). Fix the handful of components that hardcode `bg-white/*`/`border-white/*` utilities (which assume a dark backdrop) to use `foreground`-relative opacity instead, so they render correctly in both themes.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS v3.4, `next-themes` ^0.4.6 (already in `package.json`), `lucide-react` for icons.

## Global Constraints

- No new dependencies — `next-themes` is already installed and unused; do not add anything else.
- Scope is the public portfolio only. Do not touch anything under `src/app/admin/**` or `src/components/admin/**` — that's a separate follow-up (see spec's "Out of scope").
- `--primary`, `--accent`, `--ring` stay the same purple `oklch(0.54 0.24 293)` in both themes — do not create a second accent color.
- This project has no test framework (`grep -n test package.json` shows no `vitest`/`jest`). Every task's verification step is `npx tsc --noEmit` plus a manual check in the running dev server (`npm run dev`) — this matches the verification approach already used for the prior token-fix work in this codebase. Do not introduce a test framework as part of this plan.
- Full production build (`npm run build`) must pass after Task 3 (once the CSS/provider foundation exists) and again at the end (Task 8).

---

### Task 1: Wire up ThemeProvider in the root layout

**Files:**
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `<html>` gets a `class="dark"` (or no class) attribute managed at runtime by `next-themes`, which every later task's Tailwind `dark:`-aware / CSS-variable-driven styling relies on implicitly (via the `.dark` CSS block added in Task 2).

- [ ] **Step 1: Add the `ThemeProvider` import and wrap the app**

Edit `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ChatWidget } from "@/components/portfolio/chat-widget";
```

(Only the `ThemeProvider` import line is new — everything else in the import block stays as-is.)

Then replace the `RootLayout` function body:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
            <ChatWidget />
            <Toaster richColors position="top-right" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Two changes from the current file: `suppressHydrationWarning` added to `<html>` (required — `next-themes` patches the `class` attribute after first paint, which would otherwise log a hydration-mismatch warning), and the `<ThemeProvider>` wrapper around `SessionProvider`.

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check**

Run: `npm run dev`, open `http://localhost:3000` in a browser, open devtools → Elements panel, inspect the `<html>` tag.
Expected: it has `class="... dark"` if your OS/browser is in dark mode, or no `dark` class if in light mode. (The page will look unchanged either way until Task 2 adds the light palette — this step only confirms the provider is running.) Also confirm no hydration-warning is printed in the console.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: wire up next-themes ThemeProvider for light/dark switching"
```

---

### Task 2: Split the CSS palette into light (`:root`) and dark (`.dark`)

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: nothing new — `tailwind.config.ts`'s existing `oklch(var(--x) / <alpha-value>)` color definitions are unchanged and now resolve against whichever block (`:root` or `.dark`) is active.
- Produces: a visually distinct light theme. Every later task's `foreground`/`background`/`border`/`primary` token usage flips correctly once `.dark` is toggled on `<html>`.

- [ ] **Step 1: Replace the `:root` block and add a `.dark` block**

In `src/app/globals.css`, replace the existing `@layer base { :root { ... } }` block with:

```css
@layer base {
  :root {
    /* Light theme (default). Values are raw oklch() components — see
       tailwind.config.ts, which composes them via oklch(var(--x) / <alpha-value>). */
    --background: 0.99 0 0;
    --foreground: 0.15 0 0;
    --card: 0.97 0 0;
    --card-foreground: 0.15 0 0;
    --popover: 0.97 0 0;
    --popover-foreground: 0.15 0 0;
    /* Purple primary — unchanged between themes */
    --primary: 0.54 0.24 293;
    --primary-foreground: 0.97 0 0;
    --secondary: 0.94 0 0;
    --secondary-foreground: 0.15 0 0;
    --muted: 0.94 0 0;
    --muted-foreground: 0.45 0 0;
    --accent: 0.54 0.24 293;
    --accent-foreground: 0.97 0 0;
    --destructive: 0.58 0.22 27;
    --destructive-foreground: 0.97 0 0;
    --border: 0 0 0;
    --input: 0 0 0;
    --ring: 0.54 0.24 293;
    --radius: 0.75rem;
    --sidebar: oklch(0.11 0 0);
    --sidebar-foreground: oklch(0.97 0 0);
    --sidebar-primary: oklch(0.54 0.24 293);
    --sidebar-primary-foreground: oklch(0.97 0 0);
    --sidebar-accent: oklch(0.15 0 0);
    --sidebar-accent-foreground: oklch(0.97 0 0);
    --sidebar-border: oklch(1 0 0 / 8%);
    --sidebar-ring: oklch(0.54 0.24 293);
  }

  .dark {
    /* Dark theme (original palette, unchanged) */
    --background: 0.08 0 0;
    --foreground: 0.97 0 0;
    --card: 0.11 0 0;
    --card-foreground: 0.97 0 0;
    --popover: 0.11 0 0;
    --popover-foreground: 0.97 0 0;
    --primary: 0.54 0.24 293;
    --primary-foreground: 0.97 0 0;
    --secondary: 0.15 0 0;
    --secondary-foreground: 0.97 0 0;
    --muted: 0.18 0 0;
    --muted-foreground: 0.63 0 0;
    --accent: 0.54 0.24 293;
    --accent-foreground: 0.97 0 0;
    --destructive: 0.65 0.22 27;
    --destructive-foreground: 0.97 0 0;
    --border: 1 0 0;
    --input: 1 0 0;
    --ring: 0.54 0.24 293;
  }
}
```

(`--radius` and the `--sidebar-*` tokens are identical in both themes and unused by the opacity-composition system, so they only need to live in `:root`.)

- [ ] **Step 2: Make `.glass` and the scrollbar track theme-aware**

In the same file, find:

```css
  .glass {
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--radius);
  }
```

Replace with:

```css
  .glass {
    background: oklch(var(--foreground) / 4%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid oklch(var(--foreground) / 8%);
    border-radius: var(--radius);
  }
```

Find:

```css
  ::-webkit-scrollbar-track {
    background: #0a0a0a;
  }
```

Replace with:

```css
  ::-webkit-scrollbar-track {
    background: oklch(var(--background));
  }
```

Leave `.glass-hover:hover`, `.glow`, `.glow-hover:hover`, `.gradient-text`, `.timeline-line`, the scrollbar thumb, and `::selection` as they are — they already derive from `--primary`, which is intentionally identical in both themes.

- [ ] **Step 3: Verify the CSS compiles**

Run: `npx tailwindcss -i src/app/globals.css -o /tmp/theme-check.css --content "./src/**/*.tsx"`
Expected: `Done in ...ms` with no errors. Then: `rm /tmp/theme-check.css`.

- [ ] **Step 4: Manual check — preview both themes before the toggle UI exists**

Run: `npm run dev`, open `http://localhost:3000`, open devtools → Elements, manually toggle the `dark` class on the `<html>` element on and off.
Expected: with `dark` present, the page looks exactly as it did before this plan (unchanged dark theme). With `dark` removed, the background goes near-white, text goes near-black, and purple accents remain the same purple. Glass cards (project cards, skill panels) should still show a faint, correctly-tinted translucent effect in both states (dark tint on light bg, light tint on dark bg) — check the Projects and Skills sections specifically.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add light theme CSS palette alongside existing dark palette"
```

---

### Task 3: Build the theme toggle and wire it into the navbar

**Files:**
- Create: `src/components/layout/theme-toggle.tsx`
- Modify: `src/components/layout/navbar.tsx`

**Interfaces:**
- Consumes: `useTheme()` from `next-themes` (available because Task 1's `ThemeProvider` wraps the tree).
- Produces: `ThemeToggle` — a default-exported-free named export `export function ThemeToggle()`, a self-contained button with no props, importable as `import { ThemeToggle } from "@/components/layout/theme-toggle";`.

- [ ] **Step 1: Create the toggle component**

Create `src/components/layout/theme-toggle.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // resolvedTheme is undefined until next-themes reads localStorage/system
  // preference on the client — render a neutral placeholder until then to
  // avoid a server/client hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="size-8" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
```

- [ ] **Step 2: Add it to the desktop navbar**

In `src/components/layout/navbar.tsx`, add the import next to the other imports:

```tsx
import { ThemeToggle } from "@/components/layout/theme-toggle";
```

Find the desktop download-buttons block:

```tsx
        {/* Download buttons — desktop */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={handleDownloadResume}
            disabled={resumeLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-200 disabled:opacity-50"
          >
            {resumeLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            Resume
          </button>
          <button
            onClick={handleDownloadCV}
            disabled={cvLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-200 disabled:opacity-50"
          >
            {cvLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            CV
          </button>
        </div>
```

Add `<ThemeToggle />` right after the CV button, still inside the same `div`:

```tsx
        {/* Download buttons — desktop */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={handleDownloadResume}
            disabled={resumeLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-200 disabled:opacity-50"
          >
            {resumeLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            Resume
          </button>
          <button
            onClick={handleDownloadCV}
            disabled={cvLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-200 disabled:opacity-50"
          >
            {cvLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            CV
          </button>
          <ThemeToggle />
        </div>
```

- [ ] **Step 3: Add it to the mobile menu**

Find the mobile menu's download-buttons `<li>`:

```tsx
            <li className="flex gap-2 pt-1 border-t border-border mt-1">
              <button
                onClick={() => { handleDownloadResume(); setMenuOpen(false); }}
                disabled={resumeLoading}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-200 disabled:opacity-50"
              >
                {resumeLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                Resume
              </button>
              <button
                onClick={() => { handleDownloadCV(); setMenuOpen(false); }}
                disabled={cvLoading}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-200 disabled:opacity-50"
              >
                {cvLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                CV
              </button>
            </li>
```

Add a new `<li>` right after it, still inside `<ul className="px-4 py-3 space-y-1">`:

```tsx
            <li className="flex gap-2 pt-1 border-t border-border mt-1">
              <button
                onClick={() => { handleDownloadResume(); setMenuOpen(false); }}
                disabled={resumeLoading}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-200 disabled:opacity-50"
              >
                {resumeLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                Resume
              </button>
              <button
                onClick={() => { handleDownloadCV(); setMenuOpen(false); }}
                disabled={cvLoading}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-all duration-200 disabled:opacity-50"
              >
                {cvLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                CV
              </button>
            </li>
            <li className="flex justify-center pt-1">
              <ThemeToggle />
            </li>
```

- [ ] **Step 4: Verify types**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Manual check**

Run: `npm run dev`, open `http://localhost:3000`. Click the sun/moon button in the navbar.
Expected: the whole page's background/foreground/card/border colors invert immediately (no transition flash, since `disableTransitionOnChange` is set), the icon swaps between sun and moon, and reloading the page keeps your last explicit choice (check by reloading after toggling). Repeat on mobile width (resize below `md` breakpoint, open the hamburger menu) — the toggle should appear centered below the Resume/CV row.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/theme-toggle.tsx src/components/layout/navbar.tsx
git commit -m "feat: add theme toggle button to navbar"
```

---

### Task 4: Fix `hero-section.tsx` dark-only utilities

**Files:**
- Modify: `src/components/portfolio/hero-section.tsx`

**Interfaces:** none (leaf visual fix, no new exports or props).

- [ ] **Step 1: Replace the repeated outline-button color classes**

Three buttons (GitHub, LinkedIn, Download CV) share this exact `className` string:

```
"gap-2 border-white/10 bg-white/4 hover:bg-white/8 hover:border-primary/40 hover:text-primary transition-all duration-200 glow-hover"
```

Replace all 3 occurrences with:

```
"gap-2 border-foreground/10 bg-foreground/4 hover:bg-foreground/8 hover:border-primary/40 hover:text-primary transition-all duration-200 glow-hover"
```

Run this to apply it (the string is identical in all 3 places, so a single substitution is safe):

```bash
sed -i '' 's/border-white\/10 bg-white\/4 hover:bg-white\/8/border-foreground\/10 bg-foreground\/4 hover:bg-foreground\/8/g' src/components/portfolio/hero-section.tsx
```

- [ ] **Step 2: Fix the "Get In Touch" button's text color token**

Find:

```tsx
              className="gap-2 bg-primary hover:bg-primary/90 text-white border-0 glow-hover"
```

Replace with:

```tsx
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground border-0 glow-hover"
```

(This button always sits on a solid `bg-primary` — using the `primary-foreground` token instead of literal `text-white` is the semantically correct token for "text on a primary-colored surface," even though both resolve to the same near-white color in this palette.)

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `grep -n "white" src/components/portfolio/hero-section.tsx` — expect no output.

- [ ] **Step 4: Manual check**

Run: `npm run dev`, open the hero section in both themes (toggle via the navbar button from Task 3).
Expected: the GitHub/LinkedIn/Download CV outline buttons show a faint border and fill in both themes (not invisible on light background), and the "Get In Touch" button remains solid purple with white text in both themes.

- [ ] **Step 5: Commit**

```bash
git add src/components/portfolio/hero-section.tsx
git commit -m "fix: make hero section buttons theme-aware instead of dark-only"
```

---

### Task 5: Fix `skills-section.tsx` dark-only utility

**Files:**
- Modify: `src/components/portfolio/skills-section.tsx`

**Interfaces:** none.

- [ ] **Step 1: Replace the skill-badge background/border**

Find:

```tsx
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/8 text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-default"
```

Replace with:

```tsx
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-foreground/5 border border-foreground/8 text-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-default"
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `grep -n "white" src/components/portfolio/skills-section.tsx` — expect no output.

- [ ] **Step 3: Manual check**

Run: `npm run dev`, open the Skills section in both themes.
Expected: skill badges show a faint pill background/border in both themes.

- [ ] **Step 4: Commit**

```bash
git add src/components/portfolio/skills-section.tsx
git commit -m "fix: make skill badges theme-aware instead of dark-only"
```

---

### Task 6: Fix `contact-section.tsx` dark-only and leftover hardcoded-hex utilities

**Files:**
- Modify: `src/components/portfolio/contact-section.tsx`

**Interfaces:** none.

- [ ] **Step 1: Fix the decorative divider and gradient bar**

Find:

```tsx
            {/* Decorative gradient bar */}
            <div className="pt-4 border-t border-white/6">
              <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#c4b5fd] opacity-60" />
            </div>
```

Replace with:

```tsx
            {/* Decorative gradient bar */}
            <div className="pt-4 border-t border-foreground/6">
              <div className="h-1.5 w-full rounded-full bg-primary opacity-60" />
            </div>
```

(The three-stop gradient used the same leftover hardcoded hex the rest of the codebase had — collapsing to the single `primary` token, matching the rest of the site.)

- [ ] **Step 2: Fix the submit button**

Find:

```tsx
                className="w-full gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white border-0 glow-hover"
```

Replace with:

```tsx
                className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground border-0 glow-hover"
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `grep -n "white\|#7c3aed\|#a78bfa\|#6d28d9\|#c4b5fd" src/components/portfolio/contact-section.tsx` — expect no output.

- [ ] **Step 4: Manual check**

Run: `npm run dev`, open the Contact section in both themes.
Expected: the divider is faintly visible in both themes, the decorative bar and submit button are solid purple in both themes.

- [ ] **Step 5: Commit**

```bash
git add src/components/portfolio/contact-section.tsx
git commit -m "fix: make contact section theme-aware and drop leftover hardcoded hex"
```

---

### Task 7: Fix `education-section.tsx`, `languages-section.tsx`, `experience-section.tsx`

**Files:**
- Modify: `src/components/portfolio/education-section.tsx`
- Modify: `src/components/portfolio/languages-section.tsx`
- Modify: `src/components/portfolio/experience-section.tsx`

**Interfaces:** none. Grouped into one task because each is a single-line, same-pattern mechanical fix.

- [ ] **Step 1: Fix `education-section.tsx`**

Find:

```tsx
                    <div className="shrink-0 text-xs text-muted-foreground bg-white/4 border border-white/8 rounded-lg px-3 py-1.5 font-medium tabular-nums">
```

Replace with:

```tsx
                    <div className="shrink-0 text-xs text-muted-foreground bg-foreground/4 border border-foreground/8 rounded-lg px-3 py-1.5 font-medium tabular-nums">
```

- [ ] **Step 2: Fix `languages-section.tsx`**

Find:

```tsx
                        className="bg-white/4 border border-white/8 rounded-lg px-3 py-2.5 flex flex-col items-center gap-1 text-center"
```

Replace with:

```tsx
                        className="bg-foreground/4 border border-foreground/8 rounded-lg px-3 py-2.5 flex flex-col items-center gap-1 text-center"
```

Find:

```tsx
              <p className="text-xs text-gray-600 pt-2 border-t border-white/5">
```

Replace with:

```tsx
              <p className="text-xs text-muted-foreground pt-2 border-t border-foreground/5">
```

(`text-gray-600` was a raw, non-token gray inconsistent with the rest of the file, which uses `text-muted-foreground` for equivalent captions — normalizing it so it stays legible in both themes.)

- [ ] **Step 3: Fix `experience-section.tsx`**

Find:

```tsx
                        <Badge
                          variant="secondary"
                          className="bg-[#7c3aed]/15 text-[#a78bfa] border border-[#7c3aed]/20 text-xs"
                        >
                          {exp.role}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs border-white/10 text-muted-foreground"
                        >
```

Replace with:

```tsx
                        <Badge
                          variant="secondary"
                          className="bg-primary/15 text-primary border border-primary/20 text-xs"
                        >
                          {exp.role}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs border-foreground/10 text-muted-foreground"
                        >
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run:
```bash
grep -rn "white\|#7c3aed\|#a78bfa\|#6d28d9\|#c4b5fd\|text-gray-600" src/components/portfolio/education-section.tsx src/components/portfolio/languages-section.tsx src/components/portfolio/experience-section.tsx
```
Expected: no output.

- [ ] **Step 5: Manual check**

Run: `npm run dev`, open Education, Languages, and Experience sections in both themes.
Expected: the year-range pill (Education), the language proficiency tiles and CEFR legend caption (Languages), and the role/type badges (Experience) are all legible with visible borders in both themes.

- [ ] **Step 6: Commit**

```bash
git add src/components/portfolio/education-section.tsx src/components/portfolio/languages-section.tsx src/components/portfolio/experience-section.tsx
git commit -m "fix: make education, languages, and experience sections theme-aware"
```

---

### Task 8: Full-site verification

**Files:** none modified — this task only verifies.

- [ ] **Step 1: Type-check and build**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run build` — expect it to complete successfully (matches the same check used after the earlier token-fix work this session).

- [ ] **Step 2: Full manual pass in both themes**

Run: `npm run dev`, open `http://localhost:3000`, and toggle the theme button. With each theme active, scroll through every section: Hero, Experience, Projects, Skills, Education, Certifications, Languages, Contact, and the Blog (`/blog`). Confirm:
- No section has invisible text (same color as its background) or invisible borders.
- Glass cards (Projects, Skills panels) show a visible translucent tint in both themes.
- The navbar's active-link highlight and hover states are visible in both themes.
- Reloading the page after an explicit toggle keeps the chosen theme (persisted via `next-themes`' `localStorage`).

- [ ] **Step 3: Confirm the chat widget is correctly unaffected**

Open the chat widget (bottom-right bubble) in both themes.
Expected: the widget panel looks identical regardless of site theme — it's an intentionally self-contained "always light" panel (all inline `style={{...}}` hex colors, no CSS variables), the same pattern used by most embedded chat widgets. No changes needed here; this step just confirms nothing broke.

- [ ] **Step 4: Final grep sweep for anything missed**

Run:
```bash
grep -rn "bg-white/\|border-white/\|text-white\b" src/components/portfolio src/components/layout/navbar.tsx
```
Expected: no output (everything in scope has been converted). If anything shows up, it means a file wasn't covered by Tasks 4–7 — fix it the same way (swap `white` for `foreground`) before considering this plan complete.
