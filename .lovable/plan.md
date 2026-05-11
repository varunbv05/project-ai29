# Recall5 AI — Build Plan

A premium, futuristic AI study revision web app with glassmorphism UI, purple/cyan gradients, and Framer Motion animations.

## Stack notes (small adjustments)

- This template uses **TanStack Router** (file-based routing in `src/routes/`), not React Router DOM. Navigation will use `<Link to="/...">` from `@tanstack/react-router`. Functionally equivalent — same SPA UX.
- **Tailwind CSS v4** is already wired via `src/styles.css` (no `tailwind.config.js`). Design tokens go into `:root` / `.dark` and `@theme inline`.
- **Framer Motion** and **Lucide React** will be added.
- **Lovable Cloud** (managed Supabase) will be enabled for: auth-less storage of revisions (anonymous session id for now), file upload (PDFs + images), and the AI edge function.
- **Lovable AI Gateway** will power generation (default model `google/gemini-3-flash-preview`, multimodal for image/PDF handling). No external API keys needed.

## Design system

Dark-first theme committed in `src/styles.css`:

- Background: deep near-black (`oklch(0.14 0.03 270)`) with floating radial gradient blobs (purple `#A855F7`-ish + cyan `#22D3EE`-ish) behind content.
- Semantic tokens: `--background`, `--foreground`, `--card` (glass: white @ 4% on dark + backdrop blur), `--border` (white @ 8%), `--primary` (purple), `--accent` (cyan), plus `--gradient-primary`, `--gradient-glow`, `--shadow-glow`.
- Typography: display **Space Grotesk**, body **Inter** (Google Fonts via `<link>` in `__root.tsx`).
- Reusable utility classes: `.glass-card`, `.glow-button`, `.gradient-text`, `.bg-aurora` (animated gradient blobs).
- Animations: fade-in, scale-in, slide-up, shimmer; Framer Motion for page transitions, card stagger, dashboard counters.

## Routes (TanStack file-based)

```text
src/routes/
  __root.tsx          shell + fonts + aurora background + Toaster
  index.tsx           Landing
  dashboard.tsx       Dashboard layout (sidebar + Outlet)
  dashboard.index.tsx Dashboard home (stats, streak, weak topics, recent)
  dashboard.generate.tsx  AI Revision Generator
  dashboard.history.tsx   Revision History list + detail drawer
```

A persistent glass sidebar inside `dashboard.tsx` links between Home / Generate / History with `activeProps` highlight.

Each route defines its own `head()` (title + description + og tags).

## Pages

**Landing (`/`)**
- Sticky glass nav (logo, links, "Open App" CTA).
- Hero: huge gradient headline "Master any subject in 5 minutes", subcopy, glowing primary CTA, animated mock dashboard preview card.
- Feature grid (6 glass cards w/ Lucide icons): Smart Summaries, Key Concepts, Formula Sheet, Rapid-Fire Q&A, Exam Predictions, Multimodal Upload.
- "How it works" 3-step section with connected gradient line.
- Social proof / stats strip with animated counters.
- Footer.

**Dashboard home (`/dashboard`)**
- Greeting + date.
- 4 animated analytics cards: Revision Streak (flame), Total Revisions, Avg. Recall Score, Time Saved. Numbers count up with Framer Motion.
- Weak Topics tracker: list of topics with progress bars (mastery %), color-coded.
- Recent Revisions: latest 5 with subject/chapter/time, click → opens detail.
- Quick CTA card linking to Generate.

**AI Revision Generator (`/dashboard/generate`)**
- Form (glass card):
  - Subject + Chapter inputs
  - Textarea for pasted notes
  - Drag-and-drop zone (PDFs + images, multi-file, preview chips, remove)
- Glowing "Generate Revision" button (shows shimmer while loading).
- Result panel (appears with animation): tabs / sections for **5-Minute Summary**, **Key Concepts**, **Formulas**, **Rapid-Fire Questions**, **Likely Exam Questions**. Markdown rendered. "Save to History" + "Copy" actions.

**Revision History (`/dashboard/history`)**
- Search + subject filter chips.
- Grid of glass cards (subject, chapter, snippet, date). Click → side drawer with full revision content (same tab layout as Generator result).

## Backend (Lovable Cloud)

- DB tables:
  - `revisions(id, user_session, subject, chapter, input_text, summary, key_concepts, formulas, rapid_fire, exam_questions, created_at)`
  - `weak_topics(id, user_session, topic, mastery, updated_at)`
  - `streaks(user_session, current_streak, last_active)`
- Storage bucket `study-uploads` (private) for PDFs + images.
- For now, identify users by an anonymous `localStorage` session id (no auth). RLS allows access only to rows matching the supplied session id (passed via header to edge function). Easy to upgrade to real auth later.
- Edge function `generate-revision`:
  1. Accepts `{ subject, chapter, notes, fileRefs[] }`.
  2. Downloads files from Storage, sends multimodal prompt to Lovable AI Gateway.
  3. Uses tool-calling for **structured JSON output** (summary, concepts[], formulas[], rapidFire[], examQuestions[]).
  4. Inserts into `revisions`, updates `streaks`, returns JSON.
  5. Handles 429/402 with friendly toast messages.

## Components

- `components/AuroraBackground.tsx` — fixed gradient blobs.
- `components/GlassCard.tsx`
- `components/GlowButton.tsx`
- `components/StatCard.tsx` (animated counter)
- `components/Sidebar.tsx`
- `components/FileDropzone.tsx`
- `components/RevisionResult.tsx` (tabbed)
- `components/StreakRing.tsx`

## Build order

1. Add deps (`framer-motion`, `react-markdown`, `react-dropzone`), enable Lovable Cloud.
2. Set up design tokens, fonts, aurora background, glass utilities in `styles.css`.
3. Build shared components (GlassCard, GlowButton, Sidebar, AuroraBackground).
4. Build Landing page.
5. Create dashboard layout + Dashboard home with mock data first.
6. DB schema + storage bucket + edge function `generate-revision`.
7. Wire Generator page to edge function with file uploads.
8. Wire History page to DB; replace dashboard mock data with real queries.
9. Polish: page transitions, empty states, loading skeletons, toasts, mobile responsive pass.

## Open questions (won't block — sensible defaults chosen)

- **Auth**: defaulting to anonymous session-id (no login screen) for speed. Can add email/Google login later.
- **Router lib**: using TanStack Router (project standard) instead of React Router DOM — same UX.
