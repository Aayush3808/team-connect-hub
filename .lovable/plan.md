
# Make SWAMN feel like a real 3D premium site

Right now the underwater scene sits behind a heavy readability veil, so the bot barely registers. The fix is three things: **bring 3D into the foreground in dedicated moments**, **rebuild the bot to match your real CAD**, and **make scroll feel instant and physical**.

## 1. Rebuild the bot to match your model

Procedurally model it from primitives in Three.js to match the renders you shared:

- Deep-navy rounded-rectangle hull (capsule + box), glossy clear-coat material (high metalness, low roughness, strong env reflections)
- Embossed `SWAMN` wordmark on the side (extruded text geometry, same navy with rim light)
- Top antenna module: small black housing + green LED cube + brass camera lens (emissive)
- Two angled support struts going down from the hull
- Two angled propeller pods at the bottom of the struts, with spinning 3-blade props (light blue tint, metallic)
- Soft contact shadow plane and a subtle clear-coat highlight pass

## 2. Move 3D from background → foreground

Replace the always-on fullscreen veil with a hybrid:

- **Hero**: large floating bot center-stage, slowly rotating, with parallax tilt on cursor. Replaces the current static ocean image card.
- **Between sections**: bot becomes a pinned "swimmer" that traverses the page. Uses `position: sticky` + scroll progress so it overtakes you as you read, then hands off to the next section.
- **Architecture / Workflow section**: pinned scroll sequence — bot rotates 360°, hotspots fade in pointing to hull / antenna / propellers / boom with labels. This is the "wow" moment.
- **Footer**: bot descends into deep water, lights dim, bubbles trail upward.

The fullscreen underwater canvas stays, but only as a thin atmospheric layer (caustics + bubbles) behind transparent section gaps — not behind every card. Readability is preserved because real content cards keep their solid surfaces.

## 3. Make scroll feel fast and physical

- Replace the rAF throttled scroll with **Lenis** smooth-scroll for buttery 60fps inertia
- Drive all 3D transforms (bot position, rotation, camera Z, fog density) directly from Lenis progress with **spring damping** — feels reactive but never jittery
- Scroll velocity feeds two things:
  - Propeller RPM (faster scroll = faster spin + speed-line particles trailing the bot)
  - Camera dolly intensity (subtle FOV punch on fast scroll)
- Bot tilts forward/back based on scroll direction like it's actually swimming with you

## 4. Premium 3D extras beyond scroll

- **Cursor parallax** on the hero bot — gentle tilt that follows the pointer
- **Magnetic CTA buttons** that subtly pull toward the cursor
- **Caustic light shader** projected on dark sections (animated GLSL noise)
- **Scroll-triggered "depth meter"** in the side rail — shows "0m → 12m → 25m" as you descend the page, reinforcing the underwater journey
- **Section transitions** with WebGL ripple distortion when entering each new section

## Technical notes

- Stack: `three`, `@react-three/fiber@^8.18`, `@react-three/drei@^9.122` (already installed) + add `@studio-freight/lenis` for smooth scroll and `maath` for damped spring lerps
- The bot becomes a single reusable `<SwamnBot />` component used in 3 places (hero, sticky traveler, footer). One canvas per location, lazy-mounted with `IntersectionObserver` so off-screen canvases stop rendering — keeps perf strong
- DPR clamped to `[1, 1.75]`; `frameloop="demand"` for the showcase canvas, `"always"` only while in view
- `prefers-reduced-motion` falls back to a single static hero render of the bot — no scroll-driven motion
- Mobile gets a lighter version: hero bot only, no sticky traveler, no caustic shader, half particle count

## What you'll see scrolling top → bottom

```text
[Hero]          big rotating bot, parallax with cursor, propellers idling
[Problem]       bot drifts in from left, fog tints darker
[Architecture]  PINNED — bot rotates 360°, hotspot labels appear
[Workflow]      bot follows a path tracing each workflow step
[Performance]   bot speeds up, propeller blur, speed-lines
[Algae]         green caustic tint, bubbles thicken
[Team/CTA]      bot rises toward surface, light brightens
[Footer]        bot descends into the deep, scene fades to navy-deep
```

## What I will not change

- Copy, section order, fonts, color tokens, or any backend code
- Existing cards' layouts and content
- The chat assistant, forms, or routing
