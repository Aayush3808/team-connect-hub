
# Visual & Interaction Upgrades

A focused polish pass — no new features, no backend, no content rewrites. Everything stays frontend.

## 1. Hero — cinematic upgrade
- Add an animated **water ripple / particles** layer behind the logo (MagicUI `Ripple` or `Particles` in aqua tones) instead of the current static blurred blobs.
- Replace the static `<h1>` with **Word Rotate** on the accent word: "intelligent systems" → cycles "intelligent systems / autonomous fleets / circular cleanup".
- Add a subtle **BorderBeam** around the hero ocean image card.
- Stats row: count-up animation on numbers when they scroll into view, plus a soft hover lift.

## 2. Sticky scroll progress + section reveals
- Thin aqua **scroll progress bar** fixed at the top under the nav.
- Upgrade `useReveal` so cards stagger in with a slight scale + blur-out-to-in, not just a fade.
- Smooth-scroll behavior tuned (already partly there) with a small offset for the sticky nav so anchor links don't hide headings.

## 3. Navigation polish
- Active section highlighting in the nav (current link gets the aqua dot + navy text as you scroll).
- Add a proper **mobile menu** (currently hidden on mobile) — slide-down sheet with the same links + Join CTA.
- Logo gets a tiny hover micro-interaction (slow rotate of the inner shape).

## 4. Team section — premium cards
- Replace the flat initials gradient with a **MagicCard spotlight** effect (cursor-follow glow) on each member card.
- Add a hover state that reveals a small "Contact" pill for members with emails, and slides the bio up slightly.
- Tighten grid so 5+ members balance better on lg (3 cols stays, but last row centers).

## 5. Workflow / Methodology — connected timeline
- Turn the 6 "Stage" cards into a **vertical timeline on desktop** with a thin aqua connector line and animated dot that fills as you scroll.
- On mobile, keep stacked cards but add the connector.

## 6. Architecture / About — depth + motion
- About section's "2025 Prototype" disc gets a slow rotating ring + the inner gradient gently animates (already drifts; add a second counter-rotating layer).
- Add **AnimatedBeam**-style connectors between the three units (Aggregation → Pod → Retrieval) in the Architecture section to visually express the fleet relationship.

## 7. FAQ — smoother accordion
- Use shadcn Accordion (already installed) instead of whatever's there now, with a soft chevron rotate and content fade.

## 8. Chatbot polish
- Add a small **pulse ring** on the closed chat button to draw attention on first load (auto-dismisses after first open).
- Smoother open/close (scale + fade from the button origin).
- Typing dots indicator instead of "Thinking…" text.

## 9. CTA + Footer
- CTA section: add a soft animated gradient mesh background behind the heading.
- Footer: add subtle hover underlines (`story-link`) on links, and a small "Back to top" floating button that appears after 800px scroll.

## 10. Global micro-polish
- Image lazy-loading + `decoding="async"` on every `<img>` for perceived speed.
- Reduced-motion respect: wrap heavy animations in `prefers-reduced-motion: no-preference` so accessibility isn't broken.
- Consistent focus rings (aqua outline) on all interactive elements for keyboard users.

## Technical notes
- New dependency: **MagicUI components** (Ripple, BorderBeam, MagicCard, AnimatedBeam, WordRotate) — installed individually per their docs, no extra runtime.
- No changes to `Index.tsx` section order, no content edits, no backend, no SEO changes.
- All animations gated behind `prefers-reduced-motion`.

---

Want me to do **all 10**, or pick the top 3–4 you care about most? (If you say "go", I'll do everything.)
