Plan: Remove Stockholm Junior Water Prize + focused SEO & trust upgrades

## 1. Remove all Stockholm Junior Water Prize references
Clean up every mention so the site does not advertise a competition SWAMN is no longer part of.
- `index.html`: remove "Stockholm Junior Water Prize" from the keywords meta tag.
- `public/llms.txt`: rewrite the project description and Topics list to remove SJWP 2026.
- `src/components/swamn/Footer.tsx`: replace the "Competing in" block with a new, accurate label (e.g., "Mission" / "Student-led innovation" or a relevant recognition line).
- `supabase/functions/chat/index.ts`: remove "Competing in the Stockholm Junior Water Prize (India, 2026)" from the chatbot system prompt.

## 2. Fix domain-aligned social sharing image
The current OG/Twitter image is hosted on `storage.googleapis.com/...` (Lovable upload URL). For branding and search trust, move it to the `swamn.com` domain.
- Add the social image asset to `public/og-image.webp` (or `.jpg`).
- Update `index.html` OG and Twitter image URLs to `https://swamn.com/og-image.webp`.
- Add `og:image:width`, `og:image:height`, and `twitter:image:alt` tags.

## 3. Strengthen structured data for search ranking
- Keep the existing Organization and WebSite JSON-LD.
- Add a `BreadcrumbList` JSON-LD snippet for `/` and `/join`.
- Add `ImageObject` structured data for the new self-hosted OG image.
- Add `sameAs` placeholders for future social profiles (Instagram, LinkedIn, YouTube, GitHub) so the brand graph can be completed later.

## 4. Sitemap improvements
- Add `<lastmod>` dates and ISO timestamps to both URLs.
- Keep `priority` and `changefreq` values.

## 5. Add Google Search Console verification support
- Add an optional meta tag in `index.html` for Search Console site verification if the user provides a verification code.
- If no code is provided, leave a clearly commented placeholder.

## 6. Optional: lightweight analytics
- Offer to add a Google Analytics 4 or Microsoft Clarity snippet if the user shares an ID.
- Default to not adding anything if no ID is provided.

## Out of scope (requires bigger decisions)
- New pages (blog, press kit, careers).
- Real photography or video.
- Paid ads or backlink campaigns.
- Backend form handling (email capture).

## Acceptance criteria
- `rg -i "Stockholm|Junior Water Prize|SJWP"` returns zero results in the web-facing source.
- All social image URLs point to `swamn.com`.
- `sitemap.xml` validates and contains `lastmod`.
- No console or build errors.