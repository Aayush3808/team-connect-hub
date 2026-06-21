Plan: Round 2 upgrades — imagery, trust, perf/a11y, three new pages, real contact form

## A. AI-generated imagery (placeholders, swappable later)
- Generate 3 hero/illustration images via imagegen and wire into:
  - `Hero.tsx` — ocean/bot illustration replacing current asset
  - `About.tsx` — prototype/architecture illustration
  - `Team.tsx` — silhouette/team-vibe banner (initials stay on cards; banner adds warmth)
- All saved to `src/assets/` and imported as ES6 modules. Marked as "illustration" via alt text so they don't read as real photos.

## B. Trust & social proof
- New `Testimonials.tsx` section between `Achievements` and `Team` on `/`.
- 3 placeholder quotes attributed generically: "Science Mentor — Sunbeam School", "District Innovation Coordinator", "Parent & Supporter". Clearly editable copy.
- New `Partners.tsx` strip (logo wall) above the footer with 4–6 SVG placeholder badges (school, district, SDG, innovation council). Tasteful greyscale, hover color.
- Animated counter row on stats already shown in Hero (subtle count-up on view).

## C. Performance & accessibility
- Lazy-load below-the-fold sections in `Index.tsx` with `React.lazy` + `Suspense` (Performance, Algae, FutureScope, Achievements, Roadmap, FAQ, Team).
- Add `loading="lazy" decoding="async"` to all `<img>` not in the hero; preload the hero image in `index.html`.
- Add `aria-label`s on every icon-only button (chatbot toggle, back-to-top, mobile nav toggle).
- Replace any `h-screen` with `h-dvh`.
- Audit color contrast on `text-muted-foreground` over `bg-soft`; bump where AA fails.
- Ensure single `<main>` per route, semantic `<nav> <section> <article>`, proper heading order.
- Add `prefers-reduced-motion` gating to count-up + new ripple/beam animations (already present in CSS — verify).

## D. New pages (added to `App.tsx` + `sitemap.xml` + footer nav)
1. **`/updates` — Blog (Lovable Cloud DB-backed)**
   - Enable Lovable Cloud.
   - Table `posts` (id, slug, title, excerpt, content_md, cover_url, published_at, author).
   - RLS: public SELECT for `published_at IS NOT NULL`; INSERT/UPDATE/DELETE limited to authenticated admins via `user_roles` + `has_role()` (per project rules).
   - Pages: `/updates` (list) and `/updates/:slug` (detail, renders markdown).
   - Minimal admin: `/updates/new` gated by admin role with a simple form. Seed 2 example posts via insert tool.
   - SEO: per-post `<title>`, canonical, `Article` JSON-LD, OG image.
2. **`/press` — Press kit (static)**
   - Brand assets: downloadable logo (PNG/SVG), color tokens, one-paragraph boilerplate, founder bios, contact email, hi-res hero image. All from existing assets / generated illustrations.
3. **`/sponsors` — Sponsors & Partners (static)**
   - Three sponsorship tiers (Friend / Catalyst / Patron) with what's included.
   - "Become a sponsor" CTA → opens contact form prefilled with intent=sponsor.
   - Reuses Partners logo strip.

## E. Real contact form (replace mailto on `/join` + new sponsor inquiries)
- Table `contact_submissions` (id, name, email, intent, benefit, message, created_at, status, source) with RLS:
  - Public INSERT (anonymous form submission allowed).
  - SELECT/UPDATE: admins only via `has_role()`.
- Rewrite `Join.tsx` to submit via supabase client; show success/error toasts.
- Edge function `notify-submission` sends an email to `support@swamn.com` on insert (using Lovable's app email infra). If email infra isn't ready, scaffold it.
- Add zod validation server-side mirroring client-side limits (name ≤100, email valid ≤255, benefit ≤1000, message ≤2000).
- Add honeypot field + 5s minimum form fill time for spam mitigation.

## F. Footer & nav updates
- Nav: add Updates link.
- Footer: link to Updates, Press, Sponsors. Keep mission column.
- Update `sitemap.xml` to include `/updates`, `/press`, `/sponsors` and dynamic post URLs (static list for now; regenerated when posts change is out of scope — note to user).
- Update `llms.txt` Pages list.

## Technical notes
- New deps: none required (markdown rendering via existing react-markdown if installed, else `marked` — will add `marked` if missing).
- Lovable Cloud: enable before DB work.
- All grants follow the public-schema GRANT rule.
- Admin auth: bare-bones — email/password sign-in on `/updates/new`; user gets `admin` role via SQL by the project owner. Documented in a comment.

## Out of scope (flag for user)
- Real photos (will need uploads).
- Dynamic sitemap regeneration on post publish.
- Full admin dashboard / WYSIWYG editor.
- Marketing/newsletter emails (not allowed by platform).

## Acceptance
- All three new routes render and are linked from footer.
- `/updates` lists seeded posts; `/updates/:slug` renders content.
- `/join` submits a real DB row and triggers an email to support@swamn.com.
- Lighthouse a11y ≥ 95, perf ≥ 90 on mobile.
- No new console errors; build green.