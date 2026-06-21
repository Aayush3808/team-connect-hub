import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export const Footer = () => (
  <footer className="border-t border-border bg-card py-16">
    <div className="container">
      <div className="grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size={32} />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Intelligent autonomous systems for cleaner oceans, rivers, and water bodies.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["SDG 14", "SDG 12", "SDG 7"].map((s) => (
              <span key={s} className="rounded-full border border-border bg-secondary px-3 py-1 text-[0.7rem] uppercase tracking-[0.2em] text-navy/80">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">Explore</div>
          <ul className="mt-4 space-y-2 text-sm text-navy">
            <li><Link to="/updates" className="story-link">Updates</Link></li>
            <li><Link to="/sponsors" className="story-link">Sponsors</Link></li>
            <li><Link to="/press" className="story-link">Press kit</Link></li>
            <li><Link to="/join" className="story-link">Join the mission</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">Mission</div>
          <div className="mt-4 text-sm text-navy">Student-led environmental innovation</div>
          <div className="text-sm text-muted-foreground">Sunbeam School, Mughalsarai</div>
          <a href="mailto:support@swamn.com" className="story-link mt-4 inline-block text-sm text-navy">
            support@swamn.com
          </a>
        </div>
      </div>

      <div className="hairline mt-14" />

      <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground md:flex-row">
        <div>© {new Date().getFullYear()} SWAMN. All rights reserved.</div>
        <div>Built for cleaner waters.</div>
      </div>
    </div>
  </footer>
);

