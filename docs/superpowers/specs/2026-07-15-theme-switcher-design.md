# Light/Dark Theme Switcher — Design

**Date:** 2026-07-15
**Scope:** Public portfolio pages only (hero, experience, projects, skills, education,
languages, certifications, contact, blog, chat widget, navbar). The admin panel
(`/admin/**`, ~40 files) is explicitly out of scope — it hardcodes the same kind of
dark-only utilities across nearly every page and form component, but it's an internal
tool, not a first impression, and is large enough to warrant its own follow-up spec.

## Problem

The site is currently dark-only. The dark palette lives as the *only* set of CSS custom
properties in `src/app/globals.css`'s `:root` block — there is no light variant. Several
public components also hardcode `bg-white/*`, `border-white/*`, and `text-white`
Tailwind utilities that assume a dark backdrop; these would render broken (near-invisible
borders, wrong contrast) if a light background were introduced without also fixing them.

`next-themes` (`^0.4.6`) is already an installed dependency but is not wired up anywhere
— no `ThemeProvider`, no `.dark` class variant in CSS. This looks like a previously
started, never-finished attempt at the same feature.

## Approach

Use `next-themes` (already installed, no new dependency) with Tailwind's existing
`darkMode: ["class"]` config (already present in `tailwind.config.ts`, currently unused).

Rejected alternative: hand-rolled `localStorage` + React context toggle. `next-themes`
already solves the flash-of-wrong-theme-on-load problem correctly via a blocking
inline script injected before hydration; reimplementing that correctly by hand is fiddly
and this is a solved problem already sitting in `package.json`.

## Design

### 1. Theme plumbing

- `src/app/layout.tsx`: wrap children in `<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>` from `next-themes`.
- `<html>` gets `suppressHydrationWarning` (required by `next-themes` since the provider
  patches the `class` attribute after first paint, which would otherwise trigger a
  hydration-mismatch warning).
- Default theme: **system preference** (`defaultTheme="system"`, `enableSystem`). A
  returning visitor's explicit choice (if they've toggled manually) is persisted via
  `next-themes`' own `localStorage` handling and takes priority over system preference.

### 2. Color tokens (`src/app/globals.css`)

The current `:root` block is renamed to `.dark { }` unchanged (it already is the dark
palette). A new `:root { }` block is added with light-mode values:

| Token | Dark (current, unchanged) | Light (new) |
|---|---|---|
| `--background` | `0.08 0 0` | `0.99 0 0` |
| `--foreground` | `0.97 0 0` | `0.15 0 0` |
| `--card` / `--popover` | `0.11 0 0` | `0.97 0 0` |
| `--card-foreground` / `--popover-foreground` | `0.97 0 0` | `0.15 0 0` |
| `--primary` / `--accent` | `0.54 0.24 293` | `0.54 0.24 293` (unchanged — verified sufficient contrast on white) |
| `--primary-foreground` / `--accent-foreground` | `0.97 0 0` | `0.97 0 0` (white text on solid purple works in both themes) |
| `--secondary` | `0.15 0 0` | `0.94 0 0` |
| `--muted` | `0.18 0 0` | `0.94 0 0` |
| `--muted-foreground` | `0.63 0 0` | `0.45 0 0` |
| `--destructive` | `0.65 0.22 27` | `0.58 0.22 27` (slightly darker for contrast on white) |
| `--destructive-foreground` | `0.97 0 0` | `0.97 0 0` |
| `--border` / `--input` | `1 0 0` (white base, composed at fixed 8%/10% alpha in `tailwind.config.ts`) | `0 0 0` (black base, same fixed 8%/10% alpha) |
| `--ring` | `0.54 0.24 293` | `0.54 0.24 293` (unchanged) |

`tailwind.config.ts` is unchanged — it already reads these as
`oklch(var(--x) / <alpha-value>)`, so both themes flow through the same utility classes.

Shared utilities in `globals.css` that currently hardcode literal white/black also become
theme-aware:
- `.glass` background/border (currently `rgba(255,255,255,0.04)` / `rgba(255,255,255,0.08)`) → `oklch(var(--foreground) / 4%)` / `oklch(var(--foreground) / 8%)`.
- `::-webkit-scrollbar-track` (currently `#0a0a0a`) → `oklch(var(--background))`.
- Exempt from this pass (already theme-invariant or out of scope): `.gradient-text`, `.glow`, `.glow-hover`, `.timeline-line`, scrollbar thumb, `::selection` — these already derive from `--primary`, which is intentionally unchanged between themes.
- Out of scope: `.blog-editor` / `.rich-text-editor` tiptap styles — these are admin-only editor chrome, follows the admin-panel follow-up.

### 3. Component fixes (public files only)

These 7 files hardcode `bg-white/*` / `border-white/*` / `text-white` /
leftover hardcoded hex, assuming a dark backdrop. Each occurrence is replaced with a
`foreground`-opacity equivalent (e.g. `bg-white/4` → `bg-foreground/4`,
`border-white/10` → `border-foreground/10`), which resolves to a light tint on dark
backgrounds and a dark tint on light backgrounds automatically, since `foreground`
already flips between near-white (dark theme) and near-black (light theme):

- `hero-section.tsx` — 3× `border-white/10 bg-white/4 hover:bg-white/8` (social/CV buttons).
- `skills-section.tsx` — 1× `bg-white/5 border-white/8` (skill badge).
- `contact-section.tsx` — 1× `border-white/6` (divider), plus a leftover hardcoded `bg-[#7c3aed] hover:bg-[#6d28d9] text-white` submit button (missed in the earlier token-cleanup pass — folded into this work as `bg-primary hover:bg-primary/90 text-primary-foreground`).
- `education-section.tsx` — 1× `bg-white/4 border-white/8` (date pill).
- `languages-section.tsx` — 2× `bg-white/4 border-white/8`, `border-white/5`.
- `experience-section.tsx` — 1× `border-white/10` (badge).

`chat-widget.tsx` (531 lines, the largest of the 8) gets its own pass during
implementation rather than being enumerated here: most `text-white` occurrences sit on
solid-purple badge/bubble backgrounds and are correct to leave as literal white in both
themes; the panel surface itself (currently relying on default `bg-card`/`bg-background`
tokens, no obvious hardcoded panel color found in initial scan) needs verification once
the light palette exists.

### 4. Toggle UI

New `src/components/layout/theme-toggle.tsx` — a small client component using
`useTheme()` from `next-themes`, rendering a sun/moon icon button (lucide `Sun`/`Moon`)
that toggles between light and dark (based on `resolvedTheme`, so it reflects the
system-derived theme correctly on first render, not just an explicit user choice).
Rendered in `navbar.tsx` next to the Resume/CV download buttons, in both the desktop bar
and the mobile menu.

### 5. Testing

No automated visual regression test. Manual verification: run the dev server, toggle
between light and dark, visually check the 8 affected components plus the shared
utilities (glass cards, scrollbar, borders) in both themes. Confirm `npm run build`
still compiles after all changes (`tsc --noEmit` + `next build`, matching the
verification approach already used for the prior token-fix work).

## Out of scope

- Admin panel theming (~40 files) — separate follow-up spec.
- Any redesign of the light palette's specific hues beyond what's needed for contrast —
  this is a straightforward light/dark inversion, not a new visual direction.
- A three-way (light/dark/system) UI selector — the toggle is a simple two-state
  light/dark switch; system preference only determines the *initial* state.
