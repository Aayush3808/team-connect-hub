## Plan: Remove ATL, expand team, replace speculative metrics

### 1. Remove all ATL references
- **`src/components/swamn/Team.tsx`** — drop the `sub` field ("President, ATL Club", "ATL Vice-President") and remove it from the rendered "role · sub" line.
- **`src/components/swamn/Achievements.tsx`** — remove the "Developed under the ATL innovation ecosystem" milestone (and replace with a neutral one, e.g. "Self-initiated, self-funded student innovation").
- **`src/components/swamn/About.tsx`** — change the inner caption from "Built end-to-end by a team of student innovators under the ATL ecosystem." to "Built end-to-end by a self-driven team of student innovators."

### 2. Update Team section (`src/components/swamn/Team.tsx`)
Replace the 3-person grid with 5 members. Switch grid to `md:grid-cols-2 lg:grid-cols-3` so it wraps cleanly.

New team list:
- **Rishi Singh** — *Lead Innovator · Bot & Dock Designer* — leads the technical vision; designs the autonomous bot and docking model; drives AI, embedded systems, and overall engineering.
- **Vaibhav Raj** — *Co-Developer* — collaborative development, system coordination, and problem-solving.
- **Aayush Kumar Singh** — *Branding, Media & Communications* — visual identity, social presence, digital communications.
- **Manan** — *Finance Manager* — budgeting, resource planning, and financial stewardship of the initiative.
- **Aviraj** — *Business Evaluator* — market analysis, viability assessment, and strategic positioning.

Each card keeps the existing premium gradient + initials style.

### 3. Replace speculative percentage/cost metrics
Numbers like 91.7%, 92%, 11.4s, $210, 5.0%, 9.0%, 5.5h are not guaranteed — replace with qualitative, brand-appropriate descriptors.

**`src/components/swamn/Hero.tsx`** — change the 4 stat tiles to qualitative pillars:
- "Autonomous" — Self-navigating operation
- "AI-Assisted" — Vision-based detection
- "Solar-Powered" — Sustainable energy
- "Modular" — Scalable by design

**`src/components/swamn/Performance.tsx`** — rename section from "Performance & Testing" to "Engineering Principles" (or "Capabilities"). Replace the 6 metric cards (with progress bars) with 6 capability cards — no numbers, no bars, just an icon-style accent dot, a short title, and a one-line description:
- Vision-Based Detection — onboard camera + AI model identifies floating waste in real time
- Autonomous Navigation — coordinated movement without manual control
- Reliable Docking — return-to-base routine for unloading and recharging
- Continuous Operation — solar-assisted endurance for extended runs
- Sustainable Build — low-impact materials and reusable hardware
- Modular Architecture — designed to scale across rivers, lakes, and coastal zones

Drop the `w` (width) and `tone` fields and the progress-bar markup.

### 4. Out of scope
No changes to color system, layout, animations, hero image, or other sections.

### Technical notes
- All edits are localized to 4 files: `Team.tsx`, `Hero.tsx`, `Performance.tsx`, `Achievements.tsx`, `About.tsx`.
- No new assets, no new dependencies, no routing changes.
