import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const links = [
  { href: "#technology", label: "Technology" },
  { href: "#performance", label: "Performance" },
  { href: "#impact", label: "Impact" },
  { href: "#team", label: "Team" },
];

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2.5" : "py-5"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border transition-all duration-500 container-px ${
          scrolled
            ? "glass border-border/60 shadow-soft py-2.5"
            : "border-transparent bg-transparent py-3"
        }`}
      >
        <a href="#top" aria-label="SWAMN home">
          <Logo size={26} />
        </a>
        <nav className="hidden md:flex items-center gap-9 text-sm text-muted-foreground">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-navy">
              {l.label}
            </a>
          ))}
        </nav>
        <Link
          to="/join"
          className="hidden sm:inline-flex h-9 items-center rounded-full bg-navy px-4 text-xs font-medium tracking-wide text-primary-foreground transition-all hover:bg-navy-deep"
        >
          Join the Mission
        </Link>
      </div>
    </header>
  );
};
