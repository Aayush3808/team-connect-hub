## Plan

### 1. Remove Aviraaj from Team
- Edit `src/components/swamn/Team.tsx` — delete the first entry (`Aviraaj — Business Evaluator`) from the `team` array. Grid layout already adapts (sm:2 / lg:3 cols), so 6 members render cleanly.

### 2. Persistent scroll-driven 3D bot
Right now `HeroBot` only lives inside the Hero section, so it scrolls away. `BotShowcase` is a separate scene lower down. I'll unify these into one **fixed, always-on-screen bot** that reacts to scroll.

- Create `src/components/swamn/PersistentBot.tsx`:
  - A `position: fixed` full-viewport `<Canvas>` layer (right side on desktop, behind content on mobile), `pointer-events-none`, `z-index` above `UnderwaterScene` but below text/nav.
  - Reads `scrollState.progress` inside `useFrame` (no re-renders) and drives:
    - **Position**: bot travels along a scripted path across the screen (e.g. right → center → left → right) as progress goes 0→1.
    - **Rotation**: continuous yaw + scroll-velocity-boosted spin (already partially wired via `velocityRef`).
    - **Scale**: subtle pulse at section boundaries (0.15, 0.35, 0.6, 0.85 progress marks).
    - **Camera dolly**: small z push/pull tied to progress for parallax depth.
  - Cursor parallax (reuse `PointerRig`).
- Mount `<PersistentBot />` once in `src/pages/Index.tsx`, directly after `<UnderwaterScene />`.
- Remove the in-hero `<HeroBot />` render and the `<BotShowcase />` section (or keep BotShowcase as a "spotlight" moment where the persistent bot's target path pauses — simpler: remove both, since the persistent bot replaces them).

### 3. More Three.js interactivity across the site
Add lightweight, section-anchored 3D touches so the site feels genuinely built on three.js, not just a background:

- **UnderwaterScene upgrades** (`src/components/swamn/UnderwaterScene.tsx`):
  - Increase caustics/light intensity and speed with `scrollState.velocity`.
  - Add drifting bubble particles (instanced spheres) that stream faster on scroll.
  - Add slow-moving debris silhouettes (plastic bottle / bag low-poly shapes) that the bot appears to "clean" — they fade out as scroll passes cleanup sections.

- **Section-anchor interactions**:
  - **Architecture / Workflow sections**: add small inline `<Canvas>` mini-scenes showing a rotating pod / retrieval bot the user can drag to orbit (via drei `OrbitControls` with `enableZoom={false}`).
  - **Performance section**: a 3D bar chart made of extruded meshes that grow in on scroll enter.

- **Cursor-reactive hero**: mouse-following light in the hero Canvas so highlights track the pointer.

- **Scroll-linked bot animation timeline** (in `PersistentBot`):
  ```
  progress  0.00 → hero: bot right side, large, facing camera
  progress  0.20 → problem: bot drifts left, tilts down at "waste"
  progress  0.40 → about/architecture: bot centers, slow orbit
  progress  0.60 → workflow: bot moves right, props spin fast
  progress  0.80 → team/roadmap: bot pulls back small, top-right
  progress  1.00 → footer: bot exits upward
  ```
  Interpolate with `THREE.MathUtils.lerp` on each frame.

### 4. Technical notes
- Keep existing `initSmoothScroll` (Lenis) — the persistent bot reads `scrollState.progress` which Lenis already updates.
- All new Three code stays on `@react-three/fiber@^8.18` + `@react-three/drei@^9.122.0` (already installed).
- No new dependencies required.
- Bot layer `pointer-events-none` so it never blocks buttons; enable pointer-events only on the small draggable orbit widgets.
- Respect `prefers-reduced-motion` — fall back to a static bot pose.

### Files touched
- `src/components/swamn/Team.tsx` — remove Aviraaj
- `src/components/swamn/PersistentBot.tsx` — **new**, fixed scroll-driven bot layer
- `src/pages/Index.tsx` — mount PersistentBot, remove BotShowcase
- `src/components/swamn/Hero.tsx` — remove inline HeroBot (bot now global)
- `src/components/swamn/UnderwaterScene.tsx` — add bubbles + debris + scroll-reactive caustics
- `src/components/swamn/Architecture.tsx` + `Workflow.tsx` — add small draggable 3D widgets
- `src/components/swamn/Performance.tsx` — add 3D bar chart
