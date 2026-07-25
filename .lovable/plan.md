## Goal
Transform the SWAMN site into a trending, fully-3D interactive experience using **React + Vite + Three.js** (react-three-fiber + drei + postprocessing), featuring an **AI-generated GLB model** of the ASB bot, with scroll-driven 3D moments across the whole site.

> Note on Next.js: Lovable runs on React + Vite. Next.js can't be previewed here — but the visual/interaction outcome (Three.js, scroll-driven 3D, cinematic hero) is fully achievable and often smoother in Vite. Confirmed with you above.

## Visual direction (chosen for SWAMN)
**"Deep Ocean Cinematic"** — dark navy → abyss gradient background, volumetric light shafts, realistic animated water, floating particulate/plastic debris, glass-morphism UI cards, cyan accent glow. This best matches SWAMN's ocean-cleanup identity and reads as premium/trending in 2026 (think Apple Vision Pro product pages, Ocean Cleanup site, Rivian).

## Build phases

### Phase 1 — 3D foundation
- Install: `three`, `@react-three/fiber@^8.18`, `@react-three/drei@^9.122`, `@react-three/postprocessing`, `three-stdlib`, `maath`, `leva` (dev only)
- Global `<Canvas>` layer with:
  - Animated water shader (drei `MeshReflectorMaterial` + custom wave displacement)
  - Depth fog, HDRI environment (studio ocean)
  - Volumetric god-rays and bloom (postprocessing)
  - Floating plastic debris particles (instanced meshes)
- Lazy-load 3D (Suspense + fallback poster) so first paint stays fast

### Phase 2 — Generate the SWAMN bot
- Use Replicate (via connector) with a text→3D model such as `firtoz/trellis` or `ndreca/hunyuan3d-2` to generate a `.glb` of the ASB bot from a detailed prompt (catamaran-hull surface bot, solar panel top, mesh collection net, camera mast, aqua-lit accents)
- Optimize with `gltf-transform` (draco compression), save as `src/assets/models/swamn-bot.glb.asset.json`
- Load via drei `useGLTF`, wrap with idle bob + subtle rotation
- **Fallback:** if the generation quality is unusable, I'll model a stylized bot in code from primitives so the site still ships

### Phase 3 — Scroll-driven 3D scenes
Rebuild sections with `<ScrollControls>` + `useScroll` sequencing:
- **Hero** — Bot floats on water at center, camera slowly orbits, tagline fades in on glass panel
- **Technology** — Camera dollies underwater, bot's underside highlighted, exploded-view labels on parts (net, sensors, solar, propulsion)
- **Architecture** — 3D dock station rises from water, bot docks into it, data lines pulse to a floating cloud node
- **Roadmap** — Camera pulls back to reveal Earth with cyan bloom points marking Phase 1→4 deployments
- **Team, Gallery, FAQ, Footer** — Keep current 2D content but layered over the persistent 3D background with glass cards

### Phase 4 — Interactivity & polish
- Cursor magnetism on the bot; click → cinematic zoom + spec sheet overlay
- Section-anchored camera keyframes (GSAP or drei `CameraShake` + `useFrame` lerps)
- Reduced-motion fallback: static hero render + normal scroll
- Mobile: lower DPR, disable postprocessing, single hero 3D scene only
- Performance targets: <2.5s LCP on desktop, 60fps on M1/mid Android, bundle-split 3D so non-3D routes stay light

### Phase 5 — Preserve existing work
- Keep: Chatbot (Swamn Sphere), wedding easter egg, Team photos, Gallery, SEO/meta, sitemap, Cloud auth, chat edge function, security fixes
- Migrate all sections progressively so nothing goes offline during rebuild

## Technical details
```text
src/
  three/
    Scene.tsx              # global R3F Canvas
    Ocean.tsx              # animated water surface
    Bot.tsx                # loads swamn-bot.glb, animates
    Dock.tsx               # docking station model
    Debris.tsx             # instanced particles
    Effects.tsx            # bloom + god rays + DoF
    ScrollRig.tsx          # scroll → camera keyframes
  assets/models/
    swamn-bot.glb.asset.json
  components/swamn/
    (existing 2D sections refactored to sit over Scene)
```

## Estimated scope
Large multi-turn build. I'll ship in this order so you can preview progress:
1. 3D foundation + hero (visible impact immediately)
2. Bot model generation + integration
3. Scroll scenes for Technology / Architecture / Roadmap
4. Interactivity, mobile perf, polish

## Trade-offs to know
- **Bundle size:** three.js + models add ~400–700KB gzip. Mitigated via code-splitting and Draco.
- **Replicate credit:** 3D model generation costs Replicate credits (a few cents). You'll need the Replicate connector linked — I'll prompt for it when we get to Phase 2.
- **Older devices:** Full postprocessing stack can drop framerate on low-end mobiles → auto-degrade path included.

Approve and I'll start with Phase 1 (foundation + hero) so you see the new look immediately.