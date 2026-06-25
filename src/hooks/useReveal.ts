import { useEffect } from "react";

/** Adds .in to any .reveal element when it scrolls into view — enables our CSS transitions.
 *  Robust to dynamically inserted nodes and Lenis smooth-scroll. */
export function useReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" }
    );

    const observeAll = () => {
      document.querySelectorAll<HTMLElement>(".reveal:not(.in)").forEach((el) => io.observe(el));
    };
    observeAll();

    // Re-scan periodically for nodes that mount after first paint (lazy 3D sections, etc.)
    const interval = window.setInterval(observeAll, 1200);

    // Safety net: after 3.5s force-reveal anything still hidden (handles tall sticky/pinned cases)
    const fallback = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>(".reveal:not(.in)").forEach((el) => el.classList.add("in"));
    }, 3500);

    // MutationObserver to catch newly added .reveal nodes
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearInterval(interval);
      window.clearTimeout(fallback);
    };
  }, []);
}
