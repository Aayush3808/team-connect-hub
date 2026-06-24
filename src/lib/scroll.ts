import Lenis from "lenis";

/**
 * Global scroll state — driven by Lenis if available, otherwise window.scroll.
 * Components read from `scrollState` inside requestAnimationFrame / useFrame
 * without subscribing to React state (zero re-renders).
 */
export const scrollState = {
  /** 0..1 progress through the full page */
  progress: 0,
  /** signed velocity in pixels/sec, smoothed */
  velocity: 0,
  /** Lenis-smoothed scrollY in pixels */
  y: 0,
};

let lenis: Lenis | null = null;
let started = false;

export function initSmoothScroll() {
  if (started || typeof window === "undefined") return;
  started = true;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    // Fallback to native scroll bookkeeping only
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.y = window.scrollY;
      scrollState.progress = h > 0 ? window.scrollY / h : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return;
  }

  lenis = new Lenis({
    duration: 0.95,
    smoothWheel: true,
    wheelMultiplier: 1.05,
    touchMultiplier: 1.4,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
  });

  lenis.on("scroll", (e: { scroll: number; velocity: number; limit: number }) => {
    scrollState.y = e.scroll;
    scrollState.progress = e.limit > 0 ? e.scroll / e.limit : 0;
    scrollState.velocity = e.velocity;
  });

  const raf = (time: number) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

export function getLenis() {
  return lenis;
}
